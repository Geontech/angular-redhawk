import { ISerializable } from '../serialization/index';
import { Redhawk } from './redhawk';

/**
 * Represents REDHAWK update event structure indicating the state of domain 
 * changes (added, removed, current listing)
 */
export class RedhawkEvent extends Redhawk implements ISerializable<RedhawkEvent> {
    /** List of Domain Names that were added */
    public added: Array<string>;
    /** List of Domain Names that were removed */
    public removed: Array<string>;

    /** Constructor */
    constructor() {
        super();
        this.added = [];
        this.removed = [];
    }

    /** Deserializes a JSON object into this class */
    deserialize(input: any) {
        super.deserialize(input);
        this.added = input.added;
        this.removed = input.removed;
        return this;
    }
}
