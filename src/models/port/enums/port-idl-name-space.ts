/**
 * PORT IDL Namespace Enumeration
 */
export enum PortIDLNameSpace {
    UNKNOWN,
    BULKIO,
    FRONTEND,
    ExtendedEvent,
    CosEventChannelAdmin
};

/**
 * Function for converting a string name to the port IDL namespace enumeration.
 * @internal
 * @param val The value to resolve to the enumeration
 */
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
