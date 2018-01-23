import { ISerializable } from '../serialization/index';
import { SimpleCommon } from './simple-common';
import { SimpleSeqValueType } from './simple-seq-value-type';
import { ScaSimpleSeqType } from './sca-types';

/**
 *  A 'simpleSeq' Property
 */
export class SimpleSeqProperty extends SimpleCommon implements ISerializable<SimpleSeqProperty> {
    /** Array of values for the property */
    value: SimpleSeqValueType;
    /** SCA Type ('simpleSeq') */
    scaType: ScaSimpleSeqType = 'simpleSeq';

    /**
     * Deserializes a JSON object into this class
     * @param input JSON Object
     */
    deserialize(input: any) {
        super.deserialize(input);
        this.scaType = input.scaType;
        this.type = input.type;
        this.enumerations = input.enumerations;
        this.value = input.value || [];
        return this;
    }

    /**
     * Create a copy of the property.
     */
    copy(): SimpleSeqProperty {
        // SimpleCommon handles type, enumerations
        // This creates an initial copy as the base class,
        // merges this instance's changes and then deserializes
        // a copy as this class.
        const p = super.copy();
        p.scaType = this.scaType;
        p.value = this.value.slice();
        return new SimpleSeqProperty().deserialize(p);
    }

    /**
     * Update the value from the string representation
     * @param vals Comma-spaced values to convert to this property's value
     */
    valueFromString(vals: string) {
        this.value.length = 0;
        const values = vals.trim().split(',');
        for (const val of values) {
            this.value.push(SimpleCommon.valueFromString(val, this.type));
        }
    }
}
