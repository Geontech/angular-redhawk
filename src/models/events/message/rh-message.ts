import { ISerializable } from '../../serialization/index';

import { ISimpleProperties } from './simple-property';

/**
 * REDHAWK Message Events are simplified Struct properties that only convey
 * ID-Value combinations with the struct's value being a list of ID-Value
 * pairs we're calling ISimpleProperties.
 */
export class RhMessage implements ISerializable<RhMessage> {
    id: string;
    value: ISimpleProperties;

    deserialize(input: any) {
        this.id = input.id;
        this.value = input.value;
        return this;
    }
}
