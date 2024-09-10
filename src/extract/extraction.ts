import { OpenAPI, Operation, Schema } from "./model";

export interface SimpleType {
    name: string;
    concreatTypes?: (typeMap: TypeMap) => SimpleType[];
    getProperties: (typeMap: TypeMap) => SimpleType[];
    primitive?: string;
    enum?: Array<string | number | boolean | null>;
    getRef: (typeMap: TypeMap) => SimpleType | undefined;
    getParents: (typeMap: TypeMap) => SimpleType[];
    required: boolean;
    discriminatorProperty?: string;
    discriminatorMap: { [key: string]: (typeMap: TypeMap) => SimpleType }
}

export interface SimpleOperation {
    name?: string;
    path: string;
    method: string;
    parameters: SimpleType[];
    responses: { [statusCode: string]: Response };
    requestBody?: SimpleType;
}

export type TypeMap = { [key: string]: SimpleType };


function getParents(typeMap: TypeMap, schema: Schema): SimpleType[] {
    if (!schema.allOf) {
        return [];
    }

    return schema.allOf
        .filter(allOf => allOf.$ref && typeMap[allOf.$ref])
        .map(allOf => typeMap[allOf.$ref!]);
}

function getProperties(typeMap: TypeMap, schema: Schema): SimpleType[] {
    let directProperties = schema.properties || {};

    if (schema.allOf) {
        schema.allOf.filter(allOf => allOf.properties).map(allOf => allOf.properties!).forEach(
            properties => {
                directProperties = {
                    ...directProperties,
                    ...properties
                };
            });
    }

    return extractTypes(directProperties, schema.required);
}

function toSimpleType(key: string, schema: Schema, required?: string[]): SimpleType {

    const discriminatorMap = Object.entries(schema.discriminator?.mapping || {})
        .map(([k, v]) => ([k, (typeMap: TypeMap) => typeMap[v]] as [string, (typeMap: TypeMap) => SimpleType]))
        .reduce(
            (prev, [k, v]) => ({ ...prev, [k]: v }),
            {}
        );

    if (schema.oneOf) {
        return {
            name: key,
            concreatTypes: (typeMap: TypeMap) => schema.oneOf!.map(oo => typeMap[oo.$ref!]),
            primitive: "composite",
            getRef: () => undefined,
            getParents: () => [],
            getProperties: () => [],
            required: false,
            enum: schema.enum,
            discriminatorProperty: schema.discriminator?.propertyName,
            discriminatorMap
        };
    }

    if (schema.additionalProperties && typeof schema.additionalProperties === "object") {
        return {
            name: key,
            primitive: "map",
            getRef: (typeMap: TypeMap) => typeMap[(schema.additionalProperties as Schema).$ref!],
            getParents: () => [],
            getProperties: () => [],
            required: !!required && required.includes(key),
            discriminatorProperty: schema.discriminator?.propertyName,
            discriminatorMap
        };
    }

    return {
        name: key,
        primitive: schema.type,
        getRef: (typeMap: TypeMap) =>
            schema.$ref ? typeMap[schema.$ref] : schema.items ? toSimpleType("", schema.items!) : undefined,
        getParents: (typeMap: TypeMap) => getParents(typeMap, schema),
        getProperties: (typeMap: TypeMap) => getProperties(typeMap, schema),
        required: !!required && required.includes(key),
        enum: schema.enum,
        discriminatorProperty: schema.discriminator?.propertyName,
        discriminatorMap
    };
}


export function extractTypes(schemaMap?: { [key: string]: Schema }, required?: string[]): SimpleType[] {
    if (!schemaMap)
        return [];

    return Object.entries(schemaMap).map(([key, schema]) => toSimpleType(key, schema, required));
};

export const extractOperations = (openAPI: OpenAPI) => Object.entries(openAPI.paths)
    .flatMap(([path, methods]) => Object.entries(methods).map(([method, options]: [string, Operation]) =>
    ({
        name: options.operationId,
        path,
        method,
        parameters: (options.parameters || []).map(({ name, schema, required }) => toSimpleType(name, schema)),
        requestBody: options.requestBody && toSimpleType("", options.requestBody.content["application/json"].schema!)
    } as SimpleOperation)));
