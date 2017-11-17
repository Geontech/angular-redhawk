import { ISerializable } from '../serialization/index';

import { AnyValueType } from './any-value-type';
import { Mode } from './mode';
import { ScaType } from './sca-types';
import * as scaKind from './sca-kinds';

/**
 * Abstract base class for a serializable REDHAWK Property model
 */
export abstract class Property implements ISerializable<Property> {
    /** Property's unique ID */
    id: string;
    /** Typically, a more human-readable Name */
    name: string;
    /** value of the property */
    value: AnyValueType;
    /** SCA Type of the property */
    scaType: ScaType;
    /** The 'kinds' of the property */
    kinds: Array<scaKind.ScaKindPre200> | scaKind.ScaKindPost200 = 'property';
    /** Access mode */
    mode: Mode = 'readwrite';

    /**
     * Constructor 
     * @param [id] The property's ID
     * @param [name] The property's Name
     * @param [value] The value of the property
    */
    constructor(id?: string, name?: string, value?: AnyValueType) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.kinds = [];
    }

    /**
     * **WARNING:** This is a partial deserialization.
     * Used the derived classes instead:
     *  * {@link SimpleProperty}
     *  * {@link SimpleSeqProperty}
     *  * {@link StructProperty}
     *  * {@link StructSeqProperty}
     * @param input The JSON object to deserialize into this property's members.
     */
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
