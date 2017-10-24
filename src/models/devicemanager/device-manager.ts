import { ISerializable } from '../serialization/index';
import * as prop from '../property/index';
import * as resource from '../resource/index';

import { DeviceManagerRef } from './device-manager-ref';

/** 
 * Serializable REDHAWK Device manager model
 */
export class DeviceManager extends DeviceManagerRef implements ISerializable<DeviceManager> {
    properties: prop.PropertySet;
    devices: resource.ResourceRefs;
    services: resource.ResourceRefs;

    constructor() {
        super();
        this.properties = [];
        this.devices = [];
        this.services = [];
    }

    deserialize(input: any) {
        super.deserialize(input);
        this.properties = prop.deserializeProperties(input.properties);
        this.devices = resource.deserializeResourceRefs(input.devices);
        this.services = resource.deserializeResourceRefs(input.services);
        return this;
    }
}