import { ISerializable } from '../serialization/index';
import { Property } from './property';
import { StructValueType } from './struct-value-type';
import { ScaStructType } from './sca-types';
import { SimpleProperty } from './simple-property';
import { SimpleSeqProperty } from './simple-seq-property';

/**
 * Serializable REDHAWK 'struct' Property Model
 */
export class StructProperty extends Property implements ISerializable<StructProperty> {
    value:   StructValueType;
    scaType: ScaStructType = 'struct';

    /**
     * @return {string[]} List of field IDs in this structure
     */
    getFields(): string[] {
        let fields: string[] = [];
        for (let field of this.value) {
            fields.push(field.id);
        }
        return fields;
    }

    /**
     * Helper function to get individual fields from the struct's list of fields.
     * @param {string} id The ID of the field/member to return
     */
    field(id: string): SimpleProperty | SimpleSeqProperty {
        for (let field of this.value) {
            if (field.id === id) {
                return field;
            }
        }
        return undefined;
    }

    deserialize(input: any) {
        super.deserialize(input);
        this.scaType = input.scaType;
        this.value = [] as StructValueType;
        for (let field of input.value) {
            if (field.scaType === 'simple') {
                this.value.push(new SimpleProperty().deserialize(field));
            } else if (field.scaType === 'simpleSeq') {
                this.value.push(new SimpleSeqProperty().deserialize(field));
            }
        }
        return this;
    }
}
