import { Cell, Row } from "exceljs";

export const endOfWorksheet = (row: Row, mapping: Record<string, WorksheetToObjectMappingDifinition>) => {
    const columns = Object.keys(mapping).map(field => mapping[field].key);
    return columns.every(key => {
        const cell = row.getCell(key);
        const value = getCellValue(cell);
        return !isFilled(value);
    })
}

export const isFilled = (value: Cell["value"] | unknown) => {
    return value !== null && value !== undefined && value !== ""
}

export const isValidDate = (dateObject: Date) => {
    return new Date(dateObject).toString() !== "Invalid Date";
}

export const trimStringValue = (value: string | unknown) => {
    if (typeof value === "string") {
        return value.trim();
    }
    return value;
}

export const getCellValue = (cell: Cell) => {
    const { value } = cell;
    // is not a primitive type
    if (typeof value === "object") {
        if (value === null) {
            return null;
        }
        // email object
        if ("text" in value) {
            return trimStringValue(value.text);
        }
        // date object
        if (value instanceof Date) {
            return !isValidDate(value) ? "" : value;
        }
        // formula object
        if ("result" in value) {
            if (value.result instanceof Date) {
                return !isValidDate(value.result) ? "" : value.result;
            }
            return value.result;
        }
        // rich text
        if ("richText" in value && value.richText[0] && value.richText[0].text) {
            return value.richText[0].text;
        }
        return undefined;
    }
    // string or unknown
    return trimStringValue(value);
}