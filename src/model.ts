export interface Info {
    title: string;
    version: string;
    description?: string;
}

export interface Server {
    url: string;
    description?: string;
}

export interface PathItem {
    get?: Operation;
    put?: Operation;
    post?: Operation;
    delete?: Operation;
    options?: Operation;
    head?: Operation;
    patch?: Operation;
    trace?: Operation;
    servers?: Server[];
    parameters?: Parameter[];
    summary?: string;
    description?: string;
}

export interface Operation {
    summary?: string;
    description?: string;
    operationId?: string;
    parameters?: Parameter[];
    requestBody?: RequestBody;
    responses: { [statusCode: string]: Response };
    deprecated?: boolean;
    security?: SecurityRequirement[];
    tags?: string[];
    externalDocs?: ExternalDocs;
    callbacks?: { [callbackName: string]: Callback };
    servers?: Server[];
    links?: { [linkName: string]: Link };
}

export interface Parameter {
    name: string;
    in: string;
    description?: string;
    required?: boolean;
    schema: Schema;
}

export interface RequestBody {
    description?: string;
    content: { [mediaType: string]: MediaType };
    required?: boolean;
}

export interface Encoding {
    contentType?: string;
    headers?: { [headerName: string]: Header | Reference };
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
}

export interface MediaType {
    schema?: Schema;
    example?: any;
    examples?: { [exampleName: string]: Example | Reference };
    encoding?: { [encodingName: string]: Encoding };
}

export interface Reference {
    $ref: string;
}

export interface Response {
    description: string;
    headers?: { [headerName: string]: Header | Reference };
    content?: { [mediaType: string]: MediaType };
    links?: { [linkName: string]: Link };
}

export interface SecurityRequirement {
    [name: string]: string[];
}

export interface Schema {
    type?: string;
    properties?: { [key: string]: Schema };
    required?: string[];
    description?: string;
    items?: Schema;
    $ref?: string;
    allOf?: Schema[];
    oneOf?: Schema[];
    anyOf?: Schema[];
    not?: Schema;
    enum?: Array<string | number | boolean | null>;
    format?: string;
    default?: any;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: boolean;
    exclusiveMaximum?: boolean;
    multipleOf?: number;
}

export interface Components {
    schemas?: { [key: string]: Schema };
    responses?: { [key: string]: Response };
    parameters?: { [key: string]: Parameter };
    examples?: { [key: string]: Example };
    requestBodies?: { [key: string]: RequestBody };
    headers?: { [key: string]: Header };
    securitySchemes?: { [key: string]: SecurityScheme };
    links?: { [key: string]: Link };
    callbacks?: { [key: string]: Callback };
}

export interface SecurityScheme {
    type: string;
    description?: string;
    name?: string;
    in?: string;
}

export interface Discriminator {
    propertyName: string;
    mapping?: { [value: string]: string };
}

export interface XML {
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
}

export interface ExternalDocs {
    description?: string;
    url: string;
}

export interface Tag {
    name: string;
    description?: string;
    externalDocs?: ExternalDocs;
}

export interface Example {
    summary?: string;
    description?: string;
    value?: any;
    externalValue?: string;
}

export interface Link {
    operationRef?: string;
    operationId?: string;
    parameters?: { [key: string]: any };
    requestBody?: any;
    description?: string;
    server?: Server;
}

export interface Callback {
    [url: string]: PathItem;
}

// Headers have the same structure as Parameter but are used in a different context
export interface Header extends Parameter {
}

export interface OpenAPI {
    openapi: string;
    info: Info;
    servers?: Server[];
    paths: { [path: string]: PathItem };
    components?: Components;
    security?: SecurityRequirement[];
    tags?: { name: string, description?: string }[];
}
