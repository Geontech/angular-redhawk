import { CFPropertySet }             from '../shared/property';
import { ResourceRef, ResourceRefs } from '../shared/resource';

// Reference to a Waveforms
export class WaveformRef extends ResourceRef {}
export type WaveformRefs = WaveformRef[];

// Waveform model
export class Waveform extends WaveformRef {
    public properties: CFPropertySet;
    public ports: Array<any>;
    public components: ResourceRefs;
    public started: boolean;
}
