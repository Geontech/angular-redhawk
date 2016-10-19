import {
    PropertySet,
    deserializeProperties
} from '../property/property';
import {
    ResourceRef,
    ResourceRefs,
    deserializeResourceRefs
} from '../shared/resource';

import { ISerializable } from '../shared/serializable';

// Reference to a device manager (Node)
export class DeviceManagerRef extends ResourceRef {}
export type DeviceManagerRefs = Array<DeviceManagerRef>;

// Device manager model
export class DeviceManager extends DeviceManagerRef implements ISerializable<DeviceManager> {
    properties: PropertySet;
    devices: ResourceRefs;
    services: ResourceRefs;

    deserialize(input: any) {
        this.properties = deserializeProperties(input.properties);
        this.devices = deserializeResourceRefs(input.devices);
        this.services = deserializeResourceRefs(input.services);
        return this;
    }
}

export function deserializeDeviceManagerRefs(input: any): DeviceManagerRefs {
    let refs: DeviceManagerRefs = [];
    for (let ref of input) {
        refs.push(new DeviceManagerRef().deserialize(ref));
    }
    return refs;
}
