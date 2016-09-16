import { CFPropertySet } from './property';
// import { Ports } from './port';

// Reference to a Resource (Device + Component) 
export class ResourceRef {
    public name: string;
    public id: string;
}
export type ResourceRefs = Resource[];

// Resource  model
export class Resource extends ResourceRef {
    public name: string;
    public id: string;
    public started: boolean;
    public properties: CFPropertySet;
    public ports: any[]; // Ports
}
