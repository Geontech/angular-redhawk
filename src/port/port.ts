export class Port {
    public name: string;
    public repId: string;
    public direction: PortDirection;
    public idl: PortIDL;
}

export class PortIDL {
    public namespace: PortIDLNameSpace;
    public version: string;
    public type: string;
}

export type PortDirection = 'Uses' | 'Provides';
export type PortIDLNameSpace = 'BULKIO' | 'FRONTEND' | 'ExtendedEvent' | 'CosEventChannelAdmin';
