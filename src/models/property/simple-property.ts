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
        // SimpleCommon handles type, enumerations
        // This creates an initial copy as the base class,
        // merges this instance's changes and then deserializes
        // a copy as this class.
        let p = super.copy();
        p.scaType = this.scaType;
        p.value = this.value;
        return new SimpleProperty().deserialize(p);
    }

    /**
     * Update the value from the string vs. type off this property
     * @param val The string value to convert based on the type
     */
    valueFromString(val: string) {
        this.value = SimpleCommon.valueFromString(val, this.type);
    }
}
