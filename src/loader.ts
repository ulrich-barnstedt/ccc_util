import path from "node:path";
import * as fs from "node:fs";
import * as util from "node:util";

export enum RunMode {
    ALL,
    EXAMPLE,
    PROD
}

interface Options<T extends boolean> {
    run: RunMode,
    split_lines: T,
    folder: string,
    file_count: number,
    use_subfolders: true,
    inspect_output: boolean,
    output_folder: string,
    print_output: boolean,
}

const default_options: Options<true> = {
    run: RunMode.ALL,
    split_lines: true,
    folder: "./data",
    file_count: 5,
    use_subfolders: true,
    inspect_output: false,
    output_folder: "./out",
    print_output: true,
}

export const load = <T extends boolean = typeof default_options.split_lines>(
    level: number,
    options: Partial<Options<T>>,
    fn: (content: T extends true ? string[]: string) => any
) => {
    if (options.output_folder === undefined && options.folder !== undefined) options.output_folder = options.folder;
    let opt: Options<T | typeof default_options.split_lines> = {...default_options, ...options};

    let files: [string, string][] = [];
    switch (opt.run) {
        case RunMode.ALL:
        case RunMode.EXAMPLE:
            files.push([
                "example",
                opt.use_subfolders ?
                    path.join(opt.folder, `level${level}`, `level${level}_example.in`) :
                    path.join(opt.folder, `level${level}_example.in`)
            ]);
            if (opt.run === RunMode.EXAMPLE) break;
        case RunMode.PROD:
            for (let i = 1; i <= opt.file_count; i++) {
                files.push([
                    String(i),
                    opt.use_subfolders ?
                        path.join(opt.folder, `level${level}`, `level${level}_${i}.in`) :
                        path.join(opt.folder, `level${level}_${i}.in`)
                ]);
            }
    }

    for (let [id, filepath] of files) {
        const content = fs.readFileSync(filepath, "utf-8");
        let output: any;

        if (opt.split_lines) {
            let lines = content.split("\r\n");
            output = (fn as (content: string[]) => any)(lines);
        } else {
            output = (fn as (content: string) => any)(content);
        }

        if (opt.print_output) {
            if (opt.inspect_output) {
                console.log(util.inspect(output));
            } else {
                console.log(output);
            }
        } else {
            let out_path = opt.use_subfolders ?
                path.join(opt.output_folder, `level${level}`, `L${level}_${id}.out`) :
                path.join(opt.output_folder, `L${level}_${id}.out`);
            fs.mkdirSync(path.dirname(out_path), {recursive: true});

            if (Array.isArray(output)) {
                fs.writeFileSync(out_path, output.join("\n"));
            } else {
                fs.writeFileSync(out_path, String(output));
            }
        }
    }
}
