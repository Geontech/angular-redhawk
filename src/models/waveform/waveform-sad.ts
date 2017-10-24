import { ISerializable } from '../serialization/index';

/**
 * Serializable REDHAWK Waveform SAD model (i.e., a reference to an 
 * available Waveform/Application that can be launched).
 */
export class WaveformSAD implements ISerializable<WaveformSAD> {
    public name: string;
    public sad: string;

    deserialize(input: any) {
        this.name = input.name;
        this.sad = input.sad;
        return this;
    }
}
