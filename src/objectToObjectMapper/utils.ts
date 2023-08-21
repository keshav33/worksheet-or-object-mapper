export const deepCopy = (object: Object) => JSON.parse(JSON.stringify(object));

export const getPathValue = (sourceObject: object, dataPath: string, defaultValue: any, index: Array<{current: number, maxIteration: number}> = []) => {
    let updatedSourceObject = deepCopy(sourceObject);
    let indexCount = 0;
    const pathArray = dataPath.split(".");
    const isIndexedPath = pathArray.some(path => getIndexIdentifier(path));
    for (let i = 0; i < pathArray.length; i++) {
        let path = pathArray[i];
        if (getIndexIdentifier(path)) {
            path = getAdjustedIndex(path, index, indexCount);
            if (updatedSourceObject && Array.isArray(updatedSourceObject)) {
                index[indexCount].maxIteration = updatedSourceObject.length;
            }
            indexCount++;
        } else if (!isIndexedPath) {
            index.forEach(idx => {
                if (updatedSourceObject && Array.isArray(updatedSourceObject)) {
                    idx.maxIteration = updatedSourceObject.length;
                }
            })
        }
        updatedSourceObject = updatedSourceObject[path];
        if (updatedSourceObject === undefined || updatedSourceObject === null) {
            return defaultValue;
        }
    }
    index.forEach(idx => {
        if (idx.maxIteration === Infinity) {
            idx.maxIteration = index.length;
        }
    })
    return updatedSourceObject;
}

export const resolveArgs = (args: Record<string, string>, sourceObject: object, index: Array<{current: number, maxIteration: number}> = []) => {
    const resolvedArgs: Record<string, any> = {}
    Object.keys(args).forEach(key => {
        resolvedArgs[key] = getPathValue(sourceObject, args[key], null, index);
    })
    return resolvedArgs;
}

export const getIndexIdentifier = (path: string) => {
    const indexIdentfifer = ["i+", "i-", "i*", "i/"];
    return indexIdentfifer.find(identfifer => path.includes(identfifer)) || path === "i";
}

export const getAdjustedIndex = (path: string, index: Array<{current: number, maxIteration: number}>, indexCount: number) => {
    const offSet = parseInt(path[2], 10);
    switch (path[1]) {
        case '+':
            return (index[indexCount].current + offSet).toString();
        case '-':
            return (index[indexCount].current - offSet).toString();
        case '*':
            return (index[indexCount].current * offSet).toString();
        case '/':
            return parseInt((index[indexCount].current / offSet).toString()).toString();
        default:
            return index[indexCount].current.toString();
    }
}
