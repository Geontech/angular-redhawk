import { ISerializable } from '../serialization/index';

/**
 * Serializable REDHAWK 'Redhawk' top-level model which is a domain listing.
 */
export class Redhawk implements ISerializable<Redhawk> {
    public domains: Array<string>;

    constructor() {
        this.domains = [];
    }

    deserialize(input: any) {
        this.domains = input.domains;
        return this;
    }
}
