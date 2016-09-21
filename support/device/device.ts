import { Resource } from '../shared/resource';
import { PropertySet, PropertyCommand } from '../shared/property';

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
    public method: DevicePropertyCommandType;
    public status: boolean;
    public message: string;
}
export type DevicePropertyCommandType = "configure" | "allocate" | "deallocate";