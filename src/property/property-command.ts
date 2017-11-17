import { PropertySet } from '../models/index';

/**
 * Property command structure
 */
export interface IPropertyCommand {
    /** The properties to submit */
    properties: PropertySet;
}

/**
 * Standard 'command' interface for controlling properties on most entities.
 */
export class PropertyCommand implements IPropertyCommand {
    /**
     * Constructor
     * @param properties The Properties to include in the command
     */
    constructor(public properties: PropertySet) {}
}
