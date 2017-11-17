import { ISerializable } from '../serialization/index';

import * as prop from '../property/index';
import * as resource from '../resource/index';
import * as devmgr from '../devicemanager/index';
import { WaveformSADRefs, deserializeWaveformSADRefs } from '../waveform/index';

/**
 * Serializable REDHAWK Domain model
 */
export class Domain implements ISerializable<Domain> {
    /** Unique name (used for fetching) */
    public name: string;
    /** Instance ID */
    public id: string;
    /** Properties */
    public properties: prop.PropertySet;
    /** Currently running applications */
    public applications: resource.ResourceRefs;
    /** Available Waveforms to launch (SADs) */
    public waveforms: WaveformSADRefs;
    /** Device Managers */
    public deviceManagers: devmgr.DeviceManagerRefs;
    /** Active Event Channels */
    public eventChannels: Array<string>;

    /** Constructor */
    constructor() {
        this.properties = [];
        this.applications = [];
        this.waveforms = [];
        this.deviceManagers = [];
        this.eventChannels = [];
    }

    /** Deserializes a JSON object into this class */
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
