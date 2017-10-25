import { ISerializable } from '../serialization/index';

import * as enums from './enums/index';

/**
 * Serializable REDHAWK Port IDL Model
 */
export class PortIDL implements ISerializable<PortIDL> {
    public namespace: enums.PortIDLNameSpace;
    public version: string;
    public type: enums.PortIDLType;

    deserialize(input: any) {
        this.namespace = enums.resolvePortIDLNameSpace(input.namespace);
        this.version = input.version;
        this.type = enums.resolvePortIDLType(input.type);
        return this;
    }
}
