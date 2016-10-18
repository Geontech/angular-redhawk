import { Resource } from '../shared/resource';
import { PropertySet, PropertyCommand } from '../property/property';

// Device model
export class Device extends Resource { }

// Specialized property command and response structures
export class DevicePropertyCommand extends PropertyCommand {
    constructor(
        method: DevicePropertyCommandType,
        properties: PropertySet
    ) { super(properties); }
}
export class DevicePropertyCommandResponse {
    method: DevicePropertyCommandType;
    status: boolean;
    message: string;
}
export type DevicePropertyCommandType = 'configure' | 'allocate' | 'deallocate';
