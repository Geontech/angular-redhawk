import { CFPropertySet }     from './property';
import { WaveformRefs }      from './waveform';
import { DeviceManagerRefs } from './devicemanager';

// REST Domain object
export class Domain {
    public name: string;
    public id: string;
    public properties: CFPropertySet;
    public applications: WaveformRefs;
    public deviceManagers: DeviceManagerRefs;
    public eventChannels: string[];

    public someDumbFunction(derp:string): void {
        console.log('Something derped up:' + derp);
    }
}
