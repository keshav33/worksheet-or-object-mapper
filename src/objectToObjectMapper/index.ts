import { INVALID_MAPPING_TYPE, MAPPER_ERROR } from "../const/error";
import { getPathValue, resolveArgs } from "./utils";

export const objectToObjectMapper = (
    sourceObject: object,
    mapping: Record<string, ObjectToObjectMappingDefinition>,
    functionCaller: (functionName: string, cellValue: unknown) => any,
    parsedQbject: ParsedSheet = {},
    index: Array<{current: number, maxIteration: number}> = [],
): object => {
    try {
        for (const fieldName of Object.keys(mapping)) {
            const mappingDefinition = mapping[fieldName];
            // handle nested oject or array
            if (typeof mappingDefinition.value === "object") {
                if (mappingDefinition.mappingType === "array" && Array.isArray(mappingDefinition.value) && mappingDefinition.value.length === 1) {
                    index.push({current: 0, maxIteration: Infinity});
                    while (true) {
                        const resolvedObject = {};
                        objectToObjectMapper(sourceObject, mappingDefinition.value[0], functionCaller, resolvedObject, index);
                        if (index[index.length - 1].current < index[index.length - 1].maxIteration && index[index.length - 1].maxIteration !== Infinity) {
                            if (!parsedQbject[fieldName]) {
                                parsedQbject[fieldName] = [];
                            }
                            parsedQbject[fieldName].push(resolvedObject)
                            index[index.length - 1].current++;
                        } else {
                            index.pop();
                            break;
                        }
                    }
                } else if (mappingDefinition.mappingType === "object" && !Array.isArray(mappingDefinition.value)) {
                    parsedQbject[fieldName] = {};
                    objectToObjectMapper(sourceObject, mappingDefinition.value, functionCaller, parsedQbject[fieldName]);
                } else {
                    throw Error(INVALID_MAPPING_TYPE(fieldName, `mappingType: ${mappingDefinition.mappingType || "unknown"}, value: ${mappingDefinition.value}`));
                }
            } else {
                switch (mappingDefinition.mappingType) {
                    case "const":
                        parsedQbject[fieldName] = mappingDefinition.value;
                        break;
                    case "function":
                        const resolvedArgs = resolveArgs(mappingDefinition.args, sourceObject, index);
                        const resolvedValue = functionCaller(mappingDefinition.value, resolvedArgs);
                        parsedQbject[fieldName] = resolvedValue;
                        break;
                    case "path":
                        parsedQbject[fieldName] = getPathValue(sourceObject, mappingDefinition.value, null, index);
                        break;
                    default:
                    throw Error(INVALID_MAPPING_TYPE(fieldName, `mappingType: ${mappingDefinition.mappingType || "unknown"}, value: ${mappingDefinition.value}`));
                }
            }
        }
        return parsedQbject;
    } catch (err) {
        console.log(err);
        throw Error(MAPPER_ERROR);
    }
}