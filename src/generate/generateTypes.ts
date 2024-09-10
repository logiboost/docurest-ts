import { SimpleType, TypeMap } from "../extract/extraction";
import { toTypeScriptType } from "./toTypeScriptType";

function generateProperty(simpleType: SimpleType, typeMap: TypeMap) {
    const type = toTypeScriptType(simpleType, typeMap);
    const questionMark = !simpleType.required ? "?" : "";
    return `    ${simpleType.name}${questionMark}: ${type || "?"};`;
}

export function generateTypes(types: SimpleType[], typeMap: TypeMap) {
    return types.map(type => {
        const parentProperties = type.getParents(typeMap).flatMap(parentType => parentType.getProperties(typeMap));
        const properties = [...parentProperties, ...type.getProperties(typeMap)];

        const parents = type.getParents(typeMap);

        const discriminator = () => {
            if (parents.length) {
                return parents.map(parent => {
                    const parentMapEntry = Object.entries(parent.discriminatorMap)
                        .filter(([, v]) => v(typeMap) === type)
                        .map(([k]) => k)[0];
    
                    return `    ${parent.discriminatorProperty}: \'${parentMapEntry}\';\n`;
                }).join("");
            }
            return "";
        }

        if (type.discriminatorProperty) {
            const subTypes = Object.entries(type.discriminatorMap).map(([, v]) => v(typeMap).name);
            return `export type ${type.name} = ${subTypes.join(' | ')};`;
        } else {
            return `export interface ${type.name} {
${discriminator()}${properties.map(simpleType => generateProperty(simpleType, typeMap)).join("\n")}
}`}}).join("\n\n");
}