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

    constructor() {
        super();
        this.properties = [];
        this.devices = [];
        this.services = [];
    }

    deserialize(input: any) {
        super.deserialize(input);
        this.properties = deserializeProperties(input.properties);
        this.devices = deserializeResourceRefs(input.devices);
        this.services = deserializeResourceRefs(input.services);
        return this;
    }
}

export function deserializeDeviceManagerRefs(inputs?: any): DeviceManagerRefs {
    if (!inputs) {
        return [];
    }
    let refs: DeviceManagerRefs = [];
    for (let ref of inputs) {
        refs.push(new DeviceManagerRef().deserialize(ref));
    }
    return refs;
}
