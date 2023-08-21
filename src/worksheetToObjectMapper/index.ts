import { Worksheet } from "exceljs";
import { endOfWorksheet, getCellValue } from "./utils";
import { INVALID_MAPPING_TYPE, MAPPER_ERROR } from "../const/error";

export const worksheetToObjectMapper = (
    worksheet: Worksheet,
    mapping: Record<string, WorksheetToObjectMappingDifinition>,
    functionCaller: (functionName: string, cellValue: unknown) => any,
    baseIndex: number = 0,
    lastRow: number | null
): Array<ParsedSheet> => {
    try {
        const response: Array<ParsedSheet> = [];
        while (true) {
            if ((lastRow && baseIndex > lastRow) || endOfWorksheet(worksheet.getRow(baseIndex), mapping)) {
                break;
            }
            const parsedQbject: ParsedSheet = {};
            Object.keys(mapping).forEach(fieldName => {
                const mappingDefinition = mapping[fieldName];
                switch (mappingDefinition.mappingType) {
                    case "const":
                        parsedQbject[fieldName] = mappingDefinition.value;
                        break;
                    case "function":
                        const functionValue = getCellValue(worksheet.getRow(baseIndex).getCell(mappingDefinition.key));
                        const resolvedValue = functionCaller(mappingDefinition.value, functionValue);
                        parsedQbject[fieldName] = resolvedValue;
                        break;
                    case "column":
                        parsedQbject[fieldName] = getCellValue(worksheet.getRow(baseIndex).getCell(mappingDefinition.key));
                        break;
                    default:
                        throw Error(INVALID_MAPPING_TYPE(fieldName, `mappingType: ${mappingDefinition.mappingType || "unknown"}, value: ${mappingDefinition.value}`));
                }
            })
            baseIndex++;
            response.push(parsedQbject);
        }
        return response;
    } catch (err) {
        console.log(err);
        throw Error(MAPPER_ERROR)
    }
}