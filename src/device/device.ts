import { Resource } from '../base/resource';
import { PropertySet, PropertyCommand } from '../property/property';

// Device model
export class Device extends Resource { }

// Specialized property command and response structures
export interface IDevicePropertyCommand extends PropertyCommand {
    method: DevicePropertyCommandType;
}
export class DevicePropertyCommand
        extends PropertyCommand
        implements IDevicePropertyCommand {
    constructor(
        public method: DevicePropertyCommandType,
        properties: PropertySet
    ) { super(properties); }
}
export interface IDevicePropertyCommandResponse {
    method: DevicePropertyCommandType;
    status: boolean;
    message: string;
}
export type DevicePropertyCommandType = 'configure' | 'allocate' | 'deallocate';
