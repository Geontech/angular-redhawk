import { PropertySet } from '../property/property';
import { Port } from '../port/port';

// Reference to a Resource (Device + Component) 
export class ResourceRef {
    public name: string;
    public id: string;
}
export type ResourceRefs = ResourceRef[];

// Resource  model
export class Resource extends ResourceRef {
    public started: boolean;
    public properties: PropertySet;
    public ports: Array<Port>;
}
