import { ISerializable } from '../../serialization/index';

import { ISimpleProperty, ISimpleProperties } from './simple-property';

/**
 * REDHAWK Message Events are simplified Struct properties that only convey
 * ID-Value combinations with the struct's value being a list of ID-Value
 * pairs we're calling ISimpleProperties.
 */
export class RhMessage implements ISerializable<RhMessage> {
    /** ID of the related property defining the message */
    id: string;
    /** the fields of this message */
    value: ISimpleProperties;

    /** Deserializes a JSON object into a REDHAWK Message format */
    deserialize(input: any) {
        this.id = input.id;
        this.value = [];
        for (let prop of input.value) {
            this.value.push({
                id:    prop.id,
                value: prop.value
            });
        }
        return this;
    }

    /**
     * Get the field IDs of the structure
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
    field(id: string): ISimpleProperty {
        for (let field of this.value) {
            if (field.id === id) {
                return field;
            }
        }
        return undefined;
    }

    /**
     * Convenience method for taking structures that have a 'value' that is a list
     * of id-value pairs like RhMessage and turning them into a 'normal' object
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
