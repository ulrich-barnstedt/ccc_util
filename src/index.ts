import {load, RunMode} from "./loader.js";
import {EOF, operations, parseInput} from "./parametricParser.js";

load(1, {print_output: true, run: RunMode.ALL, split_lines: true}, (x) => {
    return parseInput(
        x,
        [
            operations.number(1, "n"),
            operations.string("n"),
            operations.string(EOF)
        ]
    );

    // parseInput(
    //     x,
    //     [
    //         operations.number(1, "count"),
    //         operations.string("count"),
    //         operations.string(EOF)
    //     ],
    //     [
    //         operations.string(1)
    //     ]
    // )
});