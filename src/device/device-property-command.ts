import { PropertySet }     from '../models/index';
import { PropertyCommand } from '../property/property.module';

import { DevicePropertyCommandType } from './device-property-command-type';

/**
 * DevicePropertyCommand is an extension to the standard PropertyCommand that 
 * adds the device-specific 'method' field to support configure, allocate, and
 * deallocate methods.
 */
export interface IDevicePropertyCommand extends PropertyCommand {
    /** The method to try (configure, allocate, deallcoate) */
    method: DevicePropertyCommandType;
}

/**
 * Concrete implementation of the interface, in case that is preferable.
 */
export class DevicePropertyCommand
    extends PropertyCommand
    implements IDevicePropertyCommand {

    /** 
     * Constructor
     * @param method The method to apply to the properties (configure, allocate, deallocate)
     * @param properties The list of properties to manipulate
     */
    constructor(
        public method: DevicePropertyCommandType,
        properties: PropertySet
    ) {
        super(properties);
    }
}
