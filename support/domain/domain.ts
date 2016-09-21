import { PropertySet }     from '../shared/property';
import { ResourceRefs }      from '../shared/resource';
import { DeviceManagerRefs } from '../devicemanager/devicemanager';

// REST Domain object
export class Domain {
    public name: string;
    public id: string;
    public properties: PropertySet;
    public applications: ResourceRefs;
    public waveforms: ResourceRefs;
    public deviceManagers: DeviceManagerRefs;
    public eventChannels: Array<string>;
}
