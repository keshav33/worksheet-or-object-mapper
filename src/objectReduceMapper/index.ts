import { deepCopy, getValue, removeFromPath, updateValue } from "./utils";

export const objectReduceMapper = (
    objectToBeReduced: Object,
    nodesToBeRemovedMapping: NodesToBeRemovedMapping,
    nodesToBeKeptMapping: NodesToBeKeptMapping
) => {
    const updatedObject = deepCopy(objectToBeReduced);

    // Remove duplicate nodes
    Object.keys(nodesToBeRemovedMapping).forEach(node => {
        if (updatedObject[node]) {
            const fieldsToBeRemoved = nodesToBeRemovedMapping[node];
            fieldsToBeRemoved.forEach(field => {
                if (field.includes('.')) {
                    const updatedFields = node + '.' + field;
                    const pathArray = updatedFields.split('.');
                    removeFromPath(updatedObject, pathArray, 0);
                } else {
                    delete updatedObject[node][field]
                }
            })
        }
    })

    // Nodes that are required to be saved and remove all he other nodes
    Object.keys(nodesToBeKeptMapping).forEach(node => {
        if (updatedObject[node]) {
            const fieldsToBeSaved = nodesToBeKeptMapping[node];
            const nodeCopy = deepCopy(updatedObject[node]);
            delete updatedObject[node];
            updatedObject[node] = {};
            fieldsToBeSaved.forEach(field => {
                const value = getValue(nodeCopy, field);
                updateValue(updatedObject[node], field.split('.'), 0, value);
            })
        }
    })
    return updatedObject;
}