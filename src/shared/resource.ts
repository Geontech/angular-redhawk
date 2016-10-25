import { Property, PropertySet, deserializeProperties } from '../property/property';
import { Port, Ports, deserializePorts } from '../port/port';
import { ISerializable } from './serializable';

// Reference to a Resource (Device + Component) 
export class ResourceRef implements ISerializable<ResourceRef> {
    public name: string;
    public id: string;

    deserialize(input: any) {
        this.name = input.name;
        this.id = input.id;
        return this;
    }
}
export type ResourceRefs = ResourceRef[];

// Resource  model
export class Resource extends ResourceRef implements ISerializable<Resource> {
    public started: boolean;
    public properties: PropertySet;
    public ports: Ports;

    public property(id: string): Property {
        for (let prop of this.properties) {
            if (prop.id === id) {
                return prop;
            }
        }
        return undefined;
    }

    public getPort(id: string): Port {
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
        this.ports = deserializePorts(input.ports);
        this.properties = deserializeProperties(input.properties);
        return this;
    }
}

export function deserializeResourceRefs(input: any): ResourceRefs {
    let refs: ResourceRefs = [];
    for (let ref of input) {
        refs.push(new ResourceRef().deserialize(ref));
    }
    return refs;
}
