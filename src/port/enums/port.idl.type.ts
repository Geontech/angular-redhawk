// The various IDL types
export enum PortUnknownIDLType {
    UNKNOWN = -1
}

export enum PortBulkIOType {
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

export enum PortFEIType {
    UNKNOWN      = PortUnknownIDLType.UNKNOWN,
    DigitalTuner = PortBulkIOType.dataDouble + 1,
    AnalogTuner,
    RFInfo,
    RFSource,
    GPS,
    NavData
};

export type PortIDLType = PortBulkIOType | PortFEIType;

export function resolvePortIDLType(val: string): PortIDLType {
    let idlType: PortIDLType = PortBulkIOType.UNKNOWN;
    switch (val) {
        case 'dataShort':
            idlType = PortBulkIOType.dataShort;
            break;
        case 'dataUShort':
            idlType = PortBulkIOType.dataUShort;
            break;
        case 'dataOctet':
            idlType = PortBulkIOType.dataOctet;
            break;
        case 'dataLong':
            idlType = PortBulkIOType.dataLong;
            break;
        case 'dataULong':
            idlType = PortBulkIOType.dataULong;
            break;
        case 'dataLongLong':
            idlType = PortBulkIOType.dataLongLong;
            break;
        case 'dataULongLong':
            idlType = PortBulkIOType.dataULongLong;
            break;
        case 'dataFloat':
            idlType = PortBulkIOType.dataFloat;
            break;
        case 'dataDouble':
            idlType = PortBulkIOType.dataDouble;
            break;
        case 'DigitalTuner':
            idlType = PortFEIType.DigitalTuner;
            break;
        case 'AnalogTuner':
            idlType = PortFEIType.AnalogTuner;
            break;
        case 'RFInfo':
            idlType = PortFEIType.RFInfo;
            break;
        case 'RFSource':
            idlType = PortFEIType.RFSource;
            break;
        case 'GPS':
            idlType = PortFEIType.GPS;
            break;
        case 'NavData':
            idlType = PortFEIType.NavData;
            break;
        default:
            break;
    }
    return idlType;
};
