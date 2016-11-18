import { ISerializable } from '../shared/serializable';

// Enumerations and resolvers
import {
    PortIDLNameSpace, resolvePortIDLNameSpace,
    PortDirection,    resolvePortDirection,
    PortIDLType,      resolvePortIDLType
} from './enums/enums.module';

export class Port implements ISerializable<Port> {
    public name: string;
    public repId: string;
    public direction: PortDirection;
    public idl: PortIDL;

    deserialize(input: any) {
        this.name = input.name;
        this.repId = input.repId;
        this.direction = resolvePortDirection(input.direction);
        this.idl = new PortIDL().deserialize(input.idl);
        return this;
    }
}
export type Ports = Array<Port>;

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


/**
 * @param {any} input JSON Object representing a port
 * @return {Port} the port model from the input
 */
export function deserializePort(input: any): Port {
    return new Port().deserialize(input);
}

/**
 * @param {any} input JSON Object representing a list of ports.
 * @return {Ports} The port models represented in input
 */
export function deserializePorts(inputs?: any): Ports {
    if (!inputs) {
        return [];
    }
    let ports: Ports = [];
    for (let port of inputs) {
        ports.push(deserializePort(port));
    }
    return ports;
}
