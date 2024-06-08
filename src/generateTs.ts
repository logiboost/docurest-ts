import { OpenAPI } from "./model";
import { SimpleOperation, SimpleType, TypeMap, extractOperations, extractTypes } from "./extraction";

const toTypeScriptType = (simpleType: SimpleType, typeMap: TypeMap): string => {
  if (simpleType.enum) {
    return simpleType.enum.map(val => `'${val}'`).join(' | ');
  }

  switch (simpleType.primitive) {
    case 'composite':
      return "(" + simpleType.concreatTypes!(typeMap).map(t => t.name).join(" | ") + ")";
    case 'integer':
    case 'number':
      return 'number';
    case 'string':
      return 'string';
    case 'boolean':
      return 'boolean';
    case 'array':
      return `${simpleType.getRef(typeMap) ? toTypeScriptType(simpleType.getRef(typeMap)!, typeMap) : "?"}[]`;
    case 'object':
    default:
      return simpleType.getRef(typeMap) ? simpleType.getRef(typeMap)!.name : "?";
  }
};

export function generateTs(openAPI: OpenAPI, groupName: string) {

  const schemaMap = openAPI.components?.schemas || {};

  const types: SimpleType[] = extractTypes(schemaMap);

  const typeMap: TypeMap = types.reduce((prev, curr) => ({ ...prev, [`#/components/schemas/${curr.name}`]: curr }), {});

  const operations: SimpleOperation[] = extractOperations(openAPI);

  function generateProperty(simpleType: SimpleType) {
    const type = toTypeScriptType(simpleType, typeMap);
    const questionMark = !simpleType.required ? "?" : "";
    return `    ${simpleType.name}${questionMark}: ${type || "?"};`;
  }

  function generateTypes() {
    return types.map(type => {
      const children = types.filter(child => child.getParents(typeMap).includes(type));
      if (children.length) {
        return `// export type ${type.name} = ${children.map(child => child.name).join(" | ")};`;
      }

      const parentProperties = type.getParents(typeMap).flatMap(parentType => parentType.getProperties(typeMap));
      const properties = [...parentProperties, ...type.getProperties(typeMap)];

      return `export interface ${type.name} {
${properties.map(generateProperty).join("\n")}
}`}).join("\n\n");
  }

  function generateParameters(before: string[], op: SimpleOperation) {
    return [
      ...before,
      ...op.parameters.map(p => `${p.name}: ${toTypeScriptType(p, typeMap)}`),
      ...(op.requestBody ? [`body: ${toTypeScriptType(op.requestBody, typeMap)}`] : [])
    ].join(", ");
  }

  function generateOperations() {
    return operations.map(op => {
      const { path } = op;
      const name = path.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(" ")
        .map((word, i) => i === 0 ? word : word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
        .join('');

      let addBody = "";
      if (op.requestBody) {
        addBody = ", body";
      }

      return `export const ${name} = (${generateParameters(["client: AxiosInstance"], op)}) => {
    return client.${op.method}(\`${path.replace(/{([^}]+)}/g, "${$1}")}\`${addBody});
}`;

    }).join("\n\n");
  }

  return `import { AxiosInstance } from 'axios';

${generateTypes()}

${generateOperations()}
`;
}
