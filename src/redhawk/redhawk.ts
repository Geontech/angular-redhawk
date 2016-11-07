import { ISerializable } from '../shared/serializable';

// Represents REDHAWK update event structure indicating the state of domain changes.
export interface IRedhawkEvent {
    domains: Array<string>;
    added: Array<string>;
    removed: Array<string>;
}

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
