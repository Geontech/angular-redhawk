import { ISerializable } from '../serialization/index';

import { AnyValueType } from './any-value-type';
import { Mode } from './mode';
import { ScaType } from './sca-types';
import * as scaKind from './sca-kinds';

/**
 * Abstract base class for a serializable REDHAWK Property model
 */
export abstract class Property implements ISerializable<Property> {
    id: string;
    name: string;
    value: AnyValueType;
    scaType: ScaType;
    kinds: Array<scaKind.ScaKindPre200> | scaKind.ScaKindPost200 = 'property';
    mode: Mode = 'readwrite';

    constructor(id?: string, name?: string, value?: AnyValueType) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.kinds = [];
    }

    /** WARNING: This is a partial deserialization.  Used derived classes instead */
    deserialize(input: any) {
        this.id = input.id;
        this.name = input.name;
        this.mode = input.mode;
        this.kinds = input.kinds;
        return this;
    }

    /**
     * Create a copy of this Property.
     */
    abstract copy(): Property;
}
