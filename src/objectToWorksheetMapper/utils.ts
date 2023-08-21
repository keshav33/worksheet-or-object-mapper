import { CellValue, Worksheet } from "exceljs"

export const deepCopy = (object: Object) => JSON.parse(JSON.stringify(object));

export const valueEvaluator = (worksheet: Worksheet, row: number, column: string, value: CellValue) => {
    if (value) {
        const dataType = worksheet.getRow(row).getCell(column).numFmt
        value = dataTypeConverter(dataType, value)
        worksheet.getRow(row).getCell(column).value = value
    }
}

export const dataTypeConverter = (dataType: string, value: any) => {
    switch(dataType) {
        case '0': // check if datatype is number
            return parseInt(value) || value
        default:
            return value
    }
}

export const getValue = (sourceObject: Object, dataPath: string, defaultValue: CellValue) => {
    let updatedObject = deepCopy(sourceObject);
    const pathArray = dataPath.split(".");
    for(let i = 0; i < pathArray.length; i++){
        updatedObject = updatedObject[pathArray[i]];
        if(updatedObject === undefined || updatedObject === null)
            return updatedObject;
    }
    return updatedObject;
}

const resolveArgs = (args: Record<string, string>, sourceObject: Object) => {
    const resolvedArgs: Record<string, any> = {}
    Object.keys(args).forEach(key => {
        resolvedArgs[key] = getValue(sourceObject, args[key], null);
    })
    return resolvedArgs;
}