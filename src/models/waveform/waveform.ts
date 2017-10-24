import { ISerializable } from '../serialization/index';
import * as resource from '../resource/index';

/**
 * Serializable REDHAWK Waveform model
 */
export class Waveform extends resource.Resource implements ISerializable<Waveform> {
    public components: resource.ResourceRefs;

    constructor() {
        super();
        this.components = [];
    }

    deserialize(input: any) {
        super.deserialize(input);
        this.components = resource.deserializeResourceRefs(input.components);
        return this;
    }
}
