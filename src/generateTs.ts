import { OpenAPI } from "./extract/model";
import { SimpleType, TypeMap, extractTypes } from "./extract/extraction";
import { generateOperations } from "./generate/generateOperations";
import { generateTypes } from "./generate/generateTypes";

export function generateTs(openAPI: OpenAPI, groupName: string) {

  const schemaMap = openAPI.components?.schemas || {};
  const types: SimpleType[] = extractTypes(schemaMap);
  const typeMap: TypeMap = types.reduce((prev, curr) => ({ ...prev, [`#/components/schemas/${curr.name}`]: curr }), {});

  return `import { AxiosInstance } from 'axios';

${generateTypes(types, typeMap)}

${generateOperations(openAPI, typeMap)}
`;
}
