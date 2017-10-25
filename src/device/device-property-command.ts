import { PropertySet }     from '../models/index';
import { PropertyCommand } from '../property/property.module';

import { DevicePropertyCommandType } from './device-property-command-type';

/**
 * DevicePropertyCommand is an extension to the standard PropertyCommand that 
 * adds the device-specific 'method' field to support configure, allocate, and
 * deallocate methods.
 */
export interface IDevicePropertyCommand extends PropertyCommand {
    method: DevicePropertyCommandType;
}

/**
 * Concrete implementation of the interface, in case that is preferable.
 */
export class DevicePropertyCommand
        extends PropertyCommand
        implements IDevicePropertyCommand {
    constructor(
        public method: DevicePropertyCommandType,
        properties: PropertySet
    ) { super(properties); }
}
