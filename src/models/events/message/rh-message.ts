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
}
