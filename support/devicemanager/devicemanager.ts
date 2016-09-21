import { PropertySet }             from '../shared/property';
import { ResourceRef, ResourceRefs } from '../shared/resource';

// Reference to a device manager (Node)
export class DeviceManagerRef extends ResourceRef {}
export type DeviceManagerRefs = Array<DeviceManagerRef>;

// Device manager model
export class DeviceManager extends DeviceManagerRef {
    public properties: PropertySet;
    public devices: ResourceRefs;
    public services: ResourceRefs;
}
