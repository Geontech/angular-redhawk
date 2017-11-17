import { ISerializable } from '../serialization/index';

import * as enums from './enums/index';

/**
 * Serializable REDHAWK Port IDL Model
 */
export class PortIDL implements ISerializable<PortIDL> {
    /** Port IDL Namespace */
    public namespace: enums.PortIDLNameSpace;
    /** IDL Version */
    public version: string;
    /** IDL Type */
    public type: enums.PortIDLType;

    /** Deserializes a JSON object into this class */
    deserialize(input: any) {
        this.namespace = enums.resolvePortIDLNameSpace(input.namespace);
        this.version = input.version;
        this.type = enums.resolvePortIDLType(input.type);
        return this;
    }
}
