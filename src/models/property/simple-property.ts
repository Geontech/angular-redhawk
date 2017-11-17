import { ISerializable } from '../serialization/index';
import { SimpleCommon } from './simple-common';
import { SimpleValueType } from './simple-value-type';
import { ScaSimpleType } from './sca-types';

/**
 * Serializable REDHAWK 'simple' Property Model
 */
export class SimpleProperty extends SimpleCommon implements ISerializable<SimpleProperty> {
    /** value of the property */
    value:   SimpleValueType;
    /** SCA Type ('simple') */
    scaType: ScaSimpleType = 'simple';

    /** Deserializes a JSON object into this class */
    deserialize(input: any) {
        super.deserialize(input);
        this.scaType = input.scaType;
        this.type = input.type;
        this.enumerations = input.enumerations;
        this.value = input.value;
        return this;
    }

    /**
     * Create a copy of the property.
     */
    copy(): SimpleProperty {
        let p = new SimpleProperty().deserialize(super.copy());
        return p;
    }
}
