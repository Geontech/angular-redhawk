import { ISerializable } from '../serialization/index';
import * as prop from '../property/index';
import * as port from '../port/index';

import { ResourceRef } from './resource-ref';

/**
 * Base class for Resource subclasses (Device, Component) that represents the
 * actual server-side model (properties, etc.).
 */
export class Resource extends ResourceRef implements ISerializable<Resource> {
    public started: boolean;
    public properties: prop.PropertySet;
    public ports: port.Ports;

    constructor() {
        super();
        this.properties = [];
        this.ports = [];
    }

    public property(id: string): prop.Property {
        for (let prop of this.properties) {
            if (prop.id === id) {
                return prop;
            }
        }
        return undefined;
    }

    public getPort(id: string): port.Port {
        for (let port of this.ports) {
            if (port.name === id) {
                return port;
            }
        }
        return undefined;
    }

    deserialize(input: any) {
        super.deserialize(input);
        this.started = input.started;
        this.ports = port.deserializePorts(input.ports);
        this.properties = prop.deserializeProperties(input.properties);
        return this;
    }
}