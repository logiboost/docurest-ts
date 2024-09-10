import { extractOperations, SimpleOperation, TypeMap } from "../extract/extraction";
import { OpenAPI } from "../extract/model";
import { toTypeScriptType } from "./toTypeScriptType";

function generateParameters(before: string[], op: SimpleOperation, typeMap: TypeMap) {
    return [
        ...before,
        ...op.parameters.map(p => `${p.name}: ${toTypeScriptType(p, typeMap)}`),
        ...(op.requestBody ? [`body: ${toTypeScriptType(op.requestBody, typeMap)}`] : [])
    ].join(", ");
}

export function generateOperations(openAPI: OpenAPI, typeMap: TypeMap) {
    const operations: SimpleOperation[] = extractOperations(openAPI);

    return operations.map(op => {
        const { path } = op;
        const name = path.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(" ")
            .map((word, i) => i === 0 ? word : word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
            .join('');

        let addBody = "";
        if (op.requestBody) {
            addBody = ", body";
        }

        return `export const ${name} = (${generateParameters(["client: AxiosInstance"], op, typeMap)}) => {
    return client.${op.method}(\`${path.replace(/{([^}]+)}/g, "${$1}")}\`${addBody});
}`;

    }).join("\n\n");
}