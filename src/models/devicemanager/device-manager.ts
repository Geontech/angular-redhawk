import { ISerializable } from '../serialization/index';
import * as prop from '../property/index';
import * as resource from '../resource/index';

import { DeviceManagerRef } from './device-manager-ref';

/** 
 * Serializable REDHAWK Device manager model
 */
export class DeviceManager extends DeviceManagerRef implements ISerializable<DeviceManager> {
    /** Properties listing */
    properties: prop.PropertySet;
    /** Devices listing */
    devices: resource.ResourceRefs;
    /** Services listing */
    services: resource.ResourceRefs;

    /** Constructor */
    constructor() {
        super();
        this.properties = [];
        this.devices = [];
        this.services = [];
    }

    /** Deserializes a JSON object into this class */
    deserialize(input: any) {
        super.deserialize(input);
        this.properties = prop.deserializeProperties(input.properties);
        this.devices = resource.deserializeResourceRefs(input.devices);
        this.services = resource.deserializeResourceRefs(input.services);
        return this;
    }
}