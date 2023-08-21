# object-mapper

## About

Utility to transform one object to another based or transform worksheet from object or transform object from worksheet based on given mapping.

## Utilities

1. worksheetToObjectMapper 
2. objectToWorksheetMapper 
3. objectToObjectMapper 
4. objectReduceMapper 
5. objectExpandMapper

## worksheetToObjectMapper 
Read data from worksheet and map it to object base on mapping

use exceljs to read workbook

mapping rules:
mappingType
    column: pick value from column based on provided column key
    const: set a constant value specified in value
    function: call a function with function name provided with value picked from the column key
{
    fieldName: {
        mappingType: column/const/function,
        key: "column key",
        value: "functionName" || null
    }
}

functionCaller = (functionName: string, cellValue: unknown) => {
    switch (functionName) {
        case "functionName":
            return cellValue;
        default: 
            return null;
    }
}

worksheetToObjectMapper(worksheet, mapping, functionCaller, 0, 10);

```
mapping = {
    planName: {
        mappingType: "column",
        key: "A",
        value: null
    },
    package: {
        mappingType: "const",
        key: "B",
        value: "N/A"
    }
    planQuote: {
        mappingType: "function",
        key: "C",
        value: "removeDollar"
    }
}

Output
{
    planName: "abc",
    package: "N/A",
    planQuote: 800
}
```

## objectToWorksheetMapper
Example
```

```

## objectToObjectMapper
map one object to another based on mapping

mapping rules:
fieldname is the field that will be set as object field. Value will be the return type defination

```
{
one to one value from mapping
planName: {
    mappingType: "path",
    value: "baseObject.path1.path2...",
    args: null
}

constant value instead of mapping value
package: {
    mappingType: "const",
    value: "N/A",
    args: null
}

transform value using some defined function with the arguments
planQuote: {
    mappingType: "function",
    value: "removeDollar",
    args: {
        quote: "baseObject.medicalPlan.quote"
    }
}

nested object mapping
employeeInfo: {
    mappingType: "object",
    value: {
        firstName: {
            mappingType: "path",
            value: "employee.firstName",
            args: null
        },
        lastName: {
            mappingType: "path",
            value: "employee.lastName",
            args: null
        }
    },
    args: null
}

get transformed array. Please note "i" will be auto replaced with array index of current element. Index manuplation is also supported ie. i+1 or any other operations.
Please note: wrap schema in array(Array should only have one entry)
contactInfo: {
    mappingType: "array",
    value: [
        {
            name: {
                mappingType: "path",
                value: "locations.i.employees.i.firstName",
                args: null
            },
            age: {
                mappingType: "path",
                value: "locations.i.employees.i.age",
                args: null
            }
        }
    ]
}
```

## objectReduceMapper
removed unwanted nodes from object based on mapping

nodesToBeRemovedMapping: mapping that defines which nodes are required to be removed
nodesToBeKeptMapping: mapping that defines which nodes are required to be retained and all the other will be removed

nodesToBeRemovedMapping = {
    node: [
        "list of path in node that are required to be removed"
    ]
}

nodesToBeKeptMapping = {
    node: [
        "list of path in node that are required to be retained and all the other will be removed"
    ]
}

objectReduceMapper(sourceData, nodesToBeRemovedMapping, nodesToBeKeptMapping)

Example
```
sourceData = {
    companyInfo: {
        employees: [{name: "abc", age: 30}, {name: "xyz", age: 32}],
        location: {
            state: "NY",
            industryCode: "6411"
        }
    },
    otherInfo: {
        plans: [{projName: "abc"}, {projName: "xyz"}],
        timeline: {
            done: false,
            pending: true
        }
    }
}

nodesToBeRemovedMapping = {
    companyInfo: [
        "location.state",
        "location.industryCode"
    ]
}

nodesToBeKeptMapping = {
    otherInfo: [
        "plans"
    ] 
}

Output
{
    companyInfo: {
        employees: [{name: "abc", age: 30}, {name: "xyz", age: 32}],,
        location: {}
    },
    otherInfo: {
        plans: [{projName: "abc"}, {projName: "xyz"}]
    }
}
```

## objectExpandMapper
add fields to object based on the maping provided

nodesToBeRemovedMapping: mapping that defines which nodes are required to be added

node: field where data copy needs to be added
source: object path from where the data will be copied
destination: new node name that will be added inside node
functionName: transform data using function using source data

fieldsToBeAddedMapping = {
    node: [
        {
            source: "path.path1.path2",
            destination: 'newNodeName',
            functionName: function || null
        }
    ]
}

getValueFromFunction = (functionName: string, sourceValue: Object) => {
    switch (functionName) {
        case "functionName":
            return sourceValue;
        default: 
            return null;
    }
}

objectExpandMapper(sourceData, fieldsToBeAddedMapping, getValueFromFunction)

Example
```
sourceData = {
    companyInfo: {
        employees: [{name: "abc", age: 30}, {name: "xyz", age: 32}],
        location: {
            state: "NY",
            industryCode: "6411"
        }
    },
    otherInfo: {
        plans: [{projName: "abc"}, {projName: "xyz"}],
        taskCompleted: false
    }
}

fieldsToBeAddedMapping = {
    companyInfo: [
        {
            source: "companyInfo.employees",
            destination: "emplpyeesCopy",
            function: null
        }
    ],
    otherInfo: [
        {
            source: "otherInfo.taskCompleted",
            destination: "taskStatus",
            function: "changeTrueToYorFalseToN"
        }
    ]
}

Output
{
    companyInfo: {
        employees: [{name: "abc", age: 30}, {name: "xyz", age: 32}],
        location: {
            state: "NY",
            industryCode: "6411"
        },
        emplpyeesCopy: [{name: "abc", age: 30}, {name: "xyz", age: 32}]
    },
    otherInfo: {
        plans: [{projName: "abc"}, {projName: "xyz"}],
        taskCompleted: false,
        taskStatus: "N"
    }
}
```

Copyright (c) 2023 Keshav Narang
