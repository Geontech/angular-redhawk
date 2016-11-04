import {
    PropertySet,
    deserializeProperties
} from '../property/property';
import {
    ResourceRefs,
    deserializeResourceRefs
} from '../shared/resource';
import {
    DeviceManagerRefs,
    deserializeDeviceManagerRefs
} from '../devicemanager/devicemanager';

import { ISerializable } from '../shared/serializable';

// REST Domain object
export class Domain implements ISerializable<Domain> {
    public name: string;
    public id: string;
    public properties: PropertySet;
    public applications: ResourceRefs;
    public waveforms: ResourceRefs;
    public deviceManagers: DeviceManagerRefs;
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
        this.properties = deserializeProperties(input.properties);
        this.applications = deserializeResourceRefs(input.applications);
        this.waveforms = deserializeResourceRefs(input.waveforms);
        this.deviceManagers = deserializeDeviceManagerRefs(input.deviceManagers);
        this.eventChannels = input.eventChannels;
        return this;
    }
}
