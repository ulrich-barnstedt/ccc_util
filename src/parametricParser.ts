
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

        let raw_result = data.slice(idx, op.count);
        idx += op.count;

        if (op.op_type === OperationType.ignore) continue;

        outputs[op.target!] = raw_result.map(x => {
            switch (op.op_type) {
                case OperationType.string:
                    return x;
                case OperationType.number:
                    return Number(x);
                case OperationType.bool:
                    return x === "true";
            }
        });
        if (outputs[op.target!].length === 1) outputs[op.target!] = outputs[op.target!][0];
    }

    return outputs;
}
