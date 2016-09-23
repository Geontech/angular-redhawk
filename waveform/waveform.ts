import { PropertySet }             from '../shared/property';
import { Resource, ResourceRefs } from '../shared/resource';
import { Port } from '../port/port';

// Waveform model
export class Waveform extends Resource {
    public components: ResourceRefs;
}

// Waveform SAD model
export class WaveformSAD {
    public name: string;
    public sad: string;
}
export type WaveformSADRefs = Array<WaveformSAD>;

// Waveform Launch Command and Response
export class WaveformLaunchCommand {
    constructor(name: string, started: boolean) {}
}
export class WaveformLaunchCommandResponse {
    public launched: string;
    public applications: ResourceRefs;
}

// Waveform release response
export class WaveformReleaseResponse {
    public released: string;
    public applications: ResourceRefs;
}

// Waveform Control and  Response
export class WaveformControlCommand {
    constructor(started: boolean) {}
}
export class WaveformControlCommandResponse {
    public id: string;
    public started: boolean;
}