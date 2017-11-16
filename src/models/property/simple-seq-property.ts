import { ISerializable } from '../serialization/index';
import { SimpleCommon } from './simple-common';
import { SimpleSeqValueType } from './simple-seq-value-type';
import { ScaSimpleSeqType } from './sca-types';

/**
 *  A 'simpleSeq' Property
 */
export class SimpleSeqProperty extends SimpleCommon implements ISerializable<SimpleSeqProperty> {
    value: SimpleSeqValueType;
    scaType: ScaSimpleSeqType = 'simpleSeq';

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
        const p = new SimpleSeqProperty().deserialize(super.copy());
        return p;
    }
}
