import { Worksheet } from "exceljs"
import { getValue, valueEvaluator } from "./utils"
import { resolveArgs } from "../objectToObjectMapper/utils";
import { INVALID_MAPPING_TYPE, MAPPER_ERROR } from "../const/error";


export const objectToWorksheetMapper = (
    worksheet: Worksheet,
    mapping: Record<string, ObjectToWorksheetMapping>,
    sourceArray: Array<Record<string, any>>,
    getValueFromFunction: (functionName: string, args: Record<string, any>) => any,
    baseRow = 0
) => {
    try {
        sourceArray.forEach(sourceObject => {
            let row = baseRow;
            Object.keys(mapping).forEach(fieldName => {
                const column = mapping[fieldName].key;
                switch (mapping[fieldName].mappingType) {
                    case "const":
                        valueEvaluator(worksheet, row, column, mapping[fieldName].value);
                        break;
                    case "function":
                        const functionName = mapping[fieldName].value
                        const args = mapping[fieldName].args || {};
                        const resolvedParameters = resolveArgs(args, sourceObject);
                        valueEvaluator(worksheet, row, column, getValueFromFunction(functionName, resolvedParameters));
                        break;
                    case "column":
                        valueEvaluator(worksheet, row, column, getValue(sourceObject, mapping[fieldName].value, null));
                        break;
                    default:
                        throw Error(INVALID_MAPPING_TYPE(fieldName, `mappingType: ${mapping[fieldName].mappingType || "unknown"}, value: ${mapping[fieldName].value}`));
                }
            })
            row++;
        });
    } catch (err) {
        console.log(err);
        throw Error(MAPPER_ERROR)
    }
}