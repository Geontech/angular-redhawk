import { ISerializable } from '../serialization/index';

/**
 * Serializable REDHAWK 'Redhawk' top-level model which is a domain listing.
 */
export class Redhawk implements ISerializable<Redhawk> {
    /** List of Domain Names seen by this naming service */
    public domains: Array<string>;

    /** constructor */
    constructor() {
        this.domains = [];
    }

    /** Deserializes a JSON object into this class */
    deserialize(input: any) {
        this.domains = input.domains;
        return this;
    }
}
