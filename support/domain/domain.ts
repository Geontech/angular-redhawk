import { CFPropertySet }     from '../shared/property';
import { WaveformRefs }      from '../waveform/waveform';
import { DeviceManagerRefs } from '../devicemanager/devicemanager';

// REST Domain object
export class Domain {
    public name: string;
    public id: string;
    public properties: CFPropertySet;
    public applications: WaveformRefs;
    public waveforms: WaveformRefs;
    public deviceManagers: DeviceManagerRefs;
    public eventChannels: Array<string>;
}
