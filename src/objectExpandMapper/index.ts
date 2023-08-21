import { deepCopy, getValue, updateValue } from "./utils";

export const objectExpandMapper = (
    objectToBeExpanded: Object,
    fieldsToBeAddedMapping: FieldsToBeAddedMapping,
    getValueFromFunction: (functionName: string, sourceValue: Object) => any
) => {
    const updatedObject = deepCopy(objectToBeExpanded);
    Object.keys(fieldsToBeAddedMapping).forEach(node => {
        const fieldMapping = fieldsToBeAddedMapping[node];
        fieldMapping.forEach(mapping => {
            const { source, destination, functionName } = mapping;
            let value = null;
            if (functionName !== null) {
                const sourceValue = getValue(updatedObject, source);
                value = getValueFromFunction(functionName, sourceValue);
            } else {
                value = getValue(updatedObject, source);
            }
            updateValue(updatedObject[node], destination.split('.'), 0, value);
        })
    })
    return updatedObject;
}