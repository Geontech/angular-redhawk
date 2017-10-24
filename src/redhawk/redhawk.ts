import { ISerializable } from '../base/serializable';

// Represents the REDHAWK model returned from the REST interface.
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

// Represents REDHAWK update event structure indicating the state of domain changes
// as returned by the redhawk socket.
export class RedhawkEvent extends Redhawk implements ISerializable<RedhawkEvent> {
    public added: Array<string>;
    public removed: Array<string>;

    constructor() {
        super();
        this.added = [];
        this.removed = [];
    }

    deserialize(input: any) {
        super.deserialize(input);
        this.added = input.added;
        this.removed = input.removed;
        return this;
    }
}
