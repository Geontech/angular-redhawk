import { PropertySet } from '../models/index';

/**
 * Property command structure
 */
export interface IPropertyCommand {
    properties: PropertySet;
}

/**
 * Standard 'command' interface for controlling properties on most entities.
 */
export class PropertyCommand implements IPropertyCommand {
    constructor(public properties: PropertySet) {}
}
