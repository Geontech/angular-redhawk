import { ISerializable } from '../serialization/index';

import * as prop from '../property/index';
import * as resource from '../resource/index';
import * as devmgr from '../devicemanager/index';

/**
 * Serializable REDHAWK Domain model
 */
export class Domain implements ISerializable<Domain> {
    public name: string;
    public id: string;
    public properties: prop.PropertySet;
    public applications: resource.ResourceRefs;
    public waveforms: resource.ResourceRefs;
    public deviceManagers: devmgr.DeviceManagerRefs;
    public eventChannels: Array<string>;

    constructor() {
        this.properties = [];
        this.applications = [];
        this.waveforms = [];
        this.deviceManagers = [];
        this.eventChannels = [];
    }

    deserialize(input: any) {
        this.name = input.name;
        this.id = input.id;
        this.properties = prop.deserializeProperties(input.properties);
        this.applications = resource.deserializeResourceRefs(input.applications);
        this.waveforms = resource.deserializeResourceRefs(input.waveforms);
        this.deviceManagers = devmgr.deserializeDeviceManagerRefs(input.deviceManagers);
        this.eventChannels = input.eventChannels;
        return this;
    }
}
