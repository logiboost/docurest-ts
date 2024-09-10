import { SimpleType, TypeMap } from "../extract/extraction";

export const toTypeScriptType = (simpleType: SimpleType, typeMap: TypeMap): string => {
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
      case 'map':
          return "{ [key: string]: " + (simpleType.getRef(typeMap) ? simpleType.getRef(typeMap)!.name : "?") + " }";
      case 'object':
      default:
        return simpleType.getRef(typeMap) ? simpleType.getRef(typeMap)!.name : "?";
    }
  };
  