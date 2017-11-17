/**
 * Possible values of the simple property type
 */
export type ISimplePropertyValueType = string | number | boolean;

/**
 * Message's convey these simplified properties which are id-value pairs
 */
export interface ISimpleProperty {
    /** ID of the field */
    id: string;
    /** Value of the field */
    value: ISimplePropertyValueType | Array<ISimplePropertyValueType>;
}

/**
 * List of simple properties in a message
 */
export type ISimpleProperties = Array<ISimpleProperty>;
