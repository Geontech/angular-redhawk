/**
 * Common 'unknown' IDL type in the event of error.
 */
export enum PortUnknownIDLType {
    UNKNOWN = -1
}

/**
 * REDHAWK BULKIO IDL Types
 */
export enum PortBulkIOIDLType {
    UNKNOWN = PortUnknownIDLType.UNKNOWN,
    dataShort,
    dataUShort,
    dataOctet,
    dataLong,
    dataLongLong,
    dataULong,
    dataULongLong,
    dataFloat,
    dataDouble
};

/**
 * REDHAWK FrontEnd Interfaces IDL Types
 */
export enum PortFEIIDLType {
    UNKNOWN      = PortUnknownIDLType.UNKNOWN,
    DigitalTuner = PortBulkIOIDLType.dataDouble + 1,
    AnalogTuner,
    RFInfo,
    RFSource,
    GPS,
    NavData
};

/**
 * Union type of the two port IDL types that are possible
 */
export type PortIDLType = PortBulkIOIDLType | PortFEIIDLType;

/**
 * Deserialization function for Port IDL types received from the server.
 *
 * End users should not need this method as it's used by PortIDL to ensure
 * the resulting enumeration maps to one of the above enumerations.
 */
export function resolvePortIDLType(val: string): PortIDLType {
    let idlType: PortIDLType = PortBulkIOIDLType.UNKNOWN;
    switch (val) {
        case 'dataShort':
            idlType = PortBulkIOIDLType.dataShort;
            break;
        case 'dataUShort':
            idlType = PortBulkIOIDLType.dataUShort;
            break;
        case 'dataOctet':
            idlType = PortBulkIOIDLType.dataOctet;
            break;
        case 'dataLong':
            idlType = PortBulkIOIDLType.dataLong;
            break;
        case 'dataULong':
            idlType = PortBulkIOIDLType.dataULong;
            break;
        case 'dataLongLong':
            idlType = PortBulkIOIDLType.dataLongLong;
            break;
        case 'dataULongLong':
            idlType = PortBulkIOIDLType.dataULongLong;
            break;
        case 'dataFloat':
            idlType = PortBulkIOIDLType.dataFloat;
            break;
        case 'dataDouble':
            idlType = PortBulkIOIDLType.dataDouble;
            break;
        case 'DigitalTuner':
            idlType = PortFEIIDLType.DigitalTuner;
            break;
        case 'AnalogTuner':
            idlType = PortFEIIDLType.AnalogTuner;
            break;
        case 'RFInfo':
            idlType = PortFEIIDLType.RFInfo;
            break;
        case 'RFSource':
            idlType = PortFEIIDLType.RFSource;
            break;
        case 'GPS':
            idlType = PortFEIIDLType.GPS;
            break;
        case 'NavData':
            idlType = PortFEIIDLType.NavData;
            break;
        default:
            break;
    }
    return idlType;
};
