export const deepCopy = (object: Object) => JSON.parse(JSON.stringify(object));

export const removeFromPath = (obj: Record<string, any>, keys: string[], index: number) => {
    const path = keys[index];
    if (obj.hasOwnProperty(path) && index < keys.length - 1) {
        removeFromPath(obj[path], keys, ++index);
    } else {
        delete obj[path];
    }
}

export const updateValue = (obj: Record<string, any>, keys: string[], index: number, value: Object) => {
    const path = keys[index];
    if (index < keys.length - 1) {
        if (!obj.hasOwnProperty(path)) {
            obj[path] = {};
        }
        updateValue(obj[path], keys, ++index, value);
    } else {
        obj[path] = value;
    }
}

export const getValue = (obj: Object, dataPath: string) => {
    let objCopy = deepCopy(obj);
    const pathArray = dataPath.split(".");
    for (let i = 0; i < pathArray.length; i++) {
        objCopy = objCopy[pathArray[i]];
    }
    return objCopy;
}