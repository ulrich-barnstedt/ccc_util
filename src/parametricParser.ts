
enum OperationType {
    ignore,
    number,
    bool,
    string
}

export const EOF = Infinity;
class Operation {
    op_type: OperationType;
    count: number | string;
    target: string | undefined;

    constructor(op_type: OperationType, count: number | string, target: string | undefined) {
        if (target === undefined) {
            this.op_type = OperationType.ignore;
        } else {
            this.op_type = op_type;
        }
        this.count = count;
        this.target = target;
    }
}

interface OperationCreator {
    (count?: number | string, target?: string) : Operation
}
const generateCreator = (type: OperationType) : OperationCreator =>
    (count: string | number = 1, target?: string) => new Operation(type, count, target);
export const operations: Record<keyof typeof OperationType, OperationCreator> = {
    bool   : generateCreator(OperationType.bool),
    ignore : generateCreator(OperationType.ignore),
    string : generateCreator(OperationType.string),
    number : generateCreator(OperationType.number)
}

// TODO: add support for negative parsing
export const parseInput = (data: string[], ops: Operation[]) : Record<string, any> => {
    const outputs: Record<string, any> = {};

    for (const op of ops) {
        if (op.op_type === OperationType.ignore) continue;
        outputs[op.target!] = null;

        if (typeof op.count === "number") continue;
        if (!(op.count in outputs)) throw `Undefined / not yet defined count parameter: ${op.count}`;
    }

    let idx = 0;
    for (const op of ops) {
        if (idx >= data.length) break;
        if (typeof op.count === "string") op.count = outputs[op.count];
        op.count = op.count as number;

        if (op.count <= 0) {
            continue;
        }

        let result = data.slice(idx, op.count);
        idx += op.count;

        if (op.op_type === OperationType.ignore) continue;

        result.map(x => {
            switch (op.op_type) {
                case OperationType.string:
                    return x;
                case OperationType.number:
                    return Number(x);
                case OperationType.bool:
                    return x === "true";
            }
        })
        outputs[op.target!] = result;
    }

    return outputs;
}


// do multiple iterations to resolve vars
// when all resolved, exec



// for (const op of positive) {
//     if (typeof op.count === "number") {
//         if (op.count < 1) {
//             continue;
//         } else if (op.count === 1) {
//             switch (op.op_type) {
//                 case OperationType.number:
//                     outputs[op.target!] = +data[idx];
//                     break;
//                 case OperationType.string:
//                     outputs[op.target!] = data[idx];
//                     break;
//                 case OperationType.bool:
//                     outputs[op.target!] = data[idx] === "true";
//                     break;
//             }
//         } else if (op.count === EOF) {
//             // TODO
//         } else {
//             switch (op.op_type) {
//                 case OperationType.number:
//                     outputs[op.target!] = data.slice(idx, op.count).map(x => +x);
//                     break;
//                 case OperationType.string:
//                     outputs[op.target!] = data.slice(idx, op.count);
//                     break;
//                 case OperationType.bool:
//                     outputs[op.target!] = data.slice(idx, op.count).map(x => x === "true");
//                     break;
//             }
//
//             idx += op.count;
//         }
//     } else {
//         if (op.count in outputs) {
//             op.count = outputs[op.count];
//         }
//     }
// }
// for (const op of negative) {
//
// }



// export const operations: {[key in OperationType] : OperationCreator} = Object.fromEntries(
//     // (Object.keys(OperationType) as Array<keyof typeof OperationType>)
//     Object.values(OperationType)
//         .map(k => [
//             k,
//             (count: string | number, target : string | undefined = undefined) => new Operation(OperationType[k], count, target)
//         ])
// );

// export const operations: Record<keyof typeof OperationType, OperationCreator> = Object.fromEntries(
//     Object.entries(Object.keys(OperationType))
//         .map((k) => [
//             k,
//             (count: string | number = 1, target? : string) => new Operation(OperationType.bool, count, target)
//         ])
// );

