/**
 * Module for REDHAWK Port-related models and interfaces.
 */
import { Port } from './port';

export {
    PortDirection,
    // IDL Types
    PortBulkIOIDLType,
    PortFEIIDLType,
    PortIDLType,
    PortUnknownIDLType,
    // IDL Namespace
    PortIDLNameSpace
} from './enums/index';

export { Port } from './port';
export { PortIDL } from './port-idl';

/**
 * List of Port models
 */
export type Ports = Array<Port>;

/**
 * Deserializes a JSON object into a single port
 *
 * @param {any} input JSON Object representing a port
 * @return {Port} the port model from the input
 */
export function deserializePort(input: any): Port {
    return new Port().deserialize(input);
}

/**
 * Deserializes a JSON object into a port listing.
 *
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
