import { ISerializable } from '../serialization/index';
import { Property } from './property';
import { StructSeqValueType } from './struct-seq-value-type';
import { ScaStructSeqType } from './sca-types';
import { StructProperty } from './struct-property';

/**
 * Serializable REDHAWK 'structSeq' Property Model
 */
export class StructSeqProperty extends Property implements ISerializable<StructSeqProperty> {
    value: StructSeqValueType;
    scaType: ScaStructSeqType = 'structSeq';

    /**
     * Find a StructProperty having a field whose value matches the provided one.
     *
     * @param { string } fieldId The field ID in the StructProprety to use in the match.
     * @param { string } value The value to locate at fieldId
     */
    find(fieldId: string, value: string): StructProperty {
        for (let item of this.value) {
            let field = item.field(fieldId);
            if (field && field.value === value) {
                return item;
            }
        }
        return undefined;
    }

    deserialize(input: any) {
        super.deserialize(input);
        this.scaType = input.scaType;
        this.value = [] as StructSeqValueType;
        for (let sub of input.value) {
            this.value.push(new StructProperty().deserialize(sub));
        }
        return this;
    }

    /**
     * Create a copy of the property.
     */
    copy(): StructSeqProperty {
        const p = new StructSeqProperty().deserialize(this);
        p.kinds = (this.kinds instanceof Array) ? this.kinds.slice() : this.kinds;
        return p;
    }
}
