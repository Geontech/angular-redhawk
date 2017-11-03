import { ISerializable } from '../serialization/index';
import { SimpleCommon } from './simple-common';
import { SimpleValueType } from './simple-value-type';
import { ScaSimpleType } from './sca-types';

/**
 * Serializable REDHAWK 'simple' Property Model
 */
export class SimpleProperty extends SimpleCommon implements ISerializable<SimpleProperty> {
    value:   SimpleValueType;
    scaType: ScaSimpleType = 'simple';

    deserialize(input: any) {
        super.deserialize(input);
        this.scaType = input.scaType;
        this.type = input.type;
        this.enumerations = input.enumerations;
        this.value = input.value;
        return this;
    }

    copy(): SimpleProperty {
        let p = new SimpleProperty().deserialize(super.copy());
        return p;
    }
}
