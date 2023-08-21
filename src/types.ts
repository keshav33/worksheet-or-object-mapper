declare global {

    type ParsedSheet = Record<string, any>

    type WorksheetToObjectMappingDifinition = {
        mappingType: "column" | "const" | "function",
        key: string,
        value: string
    }

    type ObjectToObjectMappingValue = string | Record<string, ObjectToObjectMappingDefinition> | Array<Record<string, ObjectToObjectMappingDefinition>>

    type ObjectToObjectMappingDefinition = {
        mappingType: "object" | "array" | "path" | "const" | "function",
        value: ObjectToObjectMappingValue,
        args: Record<string, string>
    }

    type NodesToBeRemovedMapping = Record<string, Array<string>>

    type NodesToBeKeptMapping = Record<string, Array<string>>

    type FieldsToBeAddedMapping = Record<string, Array<{
        source: string,
        destination: string,
        functionName: string
    }>>

    type ObjectToWorksheetMapping = {
        mappingType: "column" | "const" | "function",
        key: string,
        value: string,
        args: string | null
    }
}

export { };