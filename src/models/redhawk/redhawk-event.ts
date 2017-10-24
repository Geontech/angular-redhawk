import { ISerializable } from '../serialization/index';
import { Redhawk } from './redhawk';

/**
 * Represents REDHAWK update event structure indicating the state of domain 
 * changes (added, removed, current listing)
 */
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
