/**
 * Message's convey these simplified properties which are id-value pairs
 */
export interface ISimpleProperty {
    id: string;
    value: any;
}

/**
 * List of simple properties in a message
 */
export type ISimpleProperties = Array<ISimpleProperty>;
