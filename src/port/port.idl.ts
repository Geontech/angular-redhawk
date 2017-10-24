import { ISerializable } from '../base/serializable';

import {
    PortIDLNameSpace, resolvePortIDLNameSpace,
    PortIDLType,      resolvePortIDLType
} from './enums/enums.module';

export class PortIDL implements ISerializable<PortIDL> {
    public namespace: PortIDLNameSpace;
    public version: string;
    public type: PortIDLType;

    deserialize(input: any) {
        this.namespace = resolvePortIDLNameSpace(input.namespace);
        this.version = input.version;
        this.type = resolvePortIDLType(input.type);
        return this;
    }
}
