import { ISerializable } from '../serialization/index';

/**
 * Serializable REDHAWK Waveform SAD model (i.e., a reference to an 
 * available Waveform/Application that can be launched).
 */
export class WaveformSAD implements ISerializable<WaveformSAD> {
    /** Name of the Waveform for use with the {@link DomainService#launch$} */
    public name: string;
    /** The SAD location in the Domain's SCA File System {@link FileSystemService} */
    public sad: string;

    /** Deserializes a JSON object into this class */
    deserialize(input: any) {
        this.name = input.name;
        this.sad = input.sad;
        return this;
    }
}
