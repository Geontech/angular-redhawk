export enum PortIDLNameSpace {
    UNKNOWN,
    BULKIO,
    FRONTEND,
    ExtendedEvent,
    CosEventChannelAdmin
};

export function resolvePortIDLNameSpace(val: string): PortIDLNameSpace {
    let namespace: PortIDLNameSpace = PortIDLNameSpace.UNKNOWN;
    switch (val) {
        case 'BULKIO':
            namespace = PortIDLNameSpace.BULKIO;
            break;
        case 'FRONTEND':
            namespace = PortIDLNameSpace.FRONTEND;
            break;
        case 'ExtendedEvent':
            namespace = PortIDLNameSpace.ExtendedEvent;
            break;
        case 'CosEventChannelAdmin':
            namespace = PortIDLNameSpace.CosEventChannelAdmin;
            break;
        default:
            namespace = PortIDLNameSpace.UNKNOWN;
            break;
    }
    return namespace;
};
