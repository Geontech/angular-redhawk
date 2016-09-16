import { CFPropertySet }             from './property';
import { ResourceRef, ResourceRefs } from './resource';

// Reference to a Waveforms
export class WaveformRef extends ResourceRef {}
export type WaveformRefs = WaveformRef[];

// Waveform model
export class Waveform extends WaveformRef {
    public properties: CFPropertySet;
    public ports: any[];
    public components: ResourceRefs;
    public started: boolean;
}
