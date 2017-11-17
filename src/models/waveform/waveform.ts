import { ISerializable } from '../serialization/index';
import * as resource from '../resource/index';

/**
 * Serializable REDHAWK Waveform model
 */
export class Waveform extends resource.Resource implements ISerializable<Waveform> {
    /** Components in the waveform */
    public components: resource.ResourceRefs;

    /** Constructor */
    constructor() {
        super();
        this.components = [];
    }

    /** Deserializes a JSON object into this class */
    deserialize(input: any) {
        super.deserialize(input);
        this.components = resource.deserializeResourceRefs(input.components);
        return this;
    }
}
