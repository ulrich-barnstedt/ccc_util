import {load, RunMode} from "./loader.js";
import {EOF, operations, parseInput} from "./parametricParser.js";

load(1, {print_output: true, run: RunMode.ALL, split_lines: true}, (x) => {
    return JSON.stringify(parseInput(
        x,
        [
            operations.number(1, "n"),
            operations.string("n", "map"),
            operations.string(EOF, "rest")
        ]
    ));
});