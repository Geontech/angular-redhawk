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
    /** The value (fields listing) of the structure */
    value:   StructValueType;
    /** The SCA Type of the property ('struct') */
    scaType: ScaStructType = 'struct';

    /**
     * Get the structure's fields (members) IDs.
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

    /** Deserializes a JSON object into this class */
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

    /**
     * Create a copy of the property
     */
    copy(): StructProperty {
        const p = new StructProperty().deserialize(this);
        p.kinds = (this.kinds instanceof Array) ? this.kinds.slice() : this.kinds;
        return p;
    }

    /**
     * Convenience method for taking structures that have a 'value' that is a list
     * of id-value pairs like StructProperty and turning them into a 'normal' object
     * whose members are created using the de-namespaced 'id'.  
     * 
     * For example, an id of TestMessage::something on a field results in an object
     * with a 'something' member set to that field's value.
     * @return A populated Object from this message's members.
     */
    asObject<T>(): T {
        let obj = {} as T;
        for (let field of this.value) {
            const id = field.id.split('::').pop();
            obj[id] = field.value;
        }
        return obj;
    }
}
