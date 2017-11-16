import { ISerializable } from '../serialization/index';

import * as prop from '../property/index';
import * as resource from '../resource/index';
import * as devmgr from '../devicemanager/index';
import { WaveformSADRefs, deserializeWaveformSADRefs } from '../waveform/index';

/**
 * Serializable REDHAWK Domain model
 */
export class Domain implements ISerializable<Domain> {
    public name: string;
    public id: string;
    public properties: prop.PropertySet;
    public applications: resource.ResourceRefs;
    public waveforms: WaveformSADRefs;
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
        this.waveforms = deserializeWaveformSADRefs(input.waveforms);
        this.deviceManagers = devmgr.deserializeDeviceManagerRefs(input.deviceManagers);
        this.eventChannels = input.eventChannels;
        return this;
    }
}
