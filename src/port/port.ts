import { ISerializable } from '../shared/serializable';

import { PortIDL } from './port.idl';

// Enumerations and resolvers
import {
    PortDirection, resolvePortDirection,
    PortBulkIOType, PortFEIType, PortIDLNameSpace
} from './enums/enums.module';

export class Port implements ISerializable<Port> {
    public name: string;
    public repId: string;
    public direction: PortDirection;
    public idl: PortIDL;

    /** @property {boolean} Indicates this is a BULKIO port that supports the websocket interface. */
    public hasBulkioWebsocket: boolean = false;

    /** @property {boolean} Indicates this is an FEI port that supports the control interface. */
    public isFEIControllable: boolean = false;

    deserialize(input: any) {
        this.name = input.name;
        this.repId = input.repId;
        this.direction = resolvePortDirection(input.direction);
        this.idl = new PortIDL().deserialize(input.idl);

        this.hasBulkioWebsocket = (this.direction === PortDirection.Uses && this.idl.namespace === PortIDLNameSpace.BULKIO);
        this.isFEIControllable = (this.direction === PortDirection.Provides && this.idl.namespace === PortIDLNameSpace.FRONTEND);
        return this;
    }
}
export type Ports = Array<Port>;

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
