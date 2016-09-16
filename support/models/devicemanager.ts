import { CFPropertySet }             from './property';
import { ResourceRef, ResourceRefs } from './resource';

// Reference to a device manager (Node)
export class DeviceManagerRef extends ResourceRef {}
export type DeviceManagerRefs = DeviceManagerRef[];

// Device manager model
export class DeviceManager extends DeviceManagerRef {
    public properties: CFPropertySet;
    public devices: ResourceRefs;
    public services: ResourceRefs;
}
