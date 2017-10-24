import { ISerializable } from '../../base/serializable';

import { SRI } from './sri';
import { PrecisionUTCTime } from './precision.utc.time';

export enum BulkioDataType {
    dataChar,
    dataShort,
    dataLong,
    dataLongLong,
    dataULong,
    dataULongLong,
    dataFloat,
    dataDouble,
    UNKNOWN
}

export function resolve(dataType: string): BulkioDataType {
    switch (dataType) {
        case 'dataChar':
            return BulkioDataType.dataChar;
        case 'dataShort':
            return BulkioDataType.dataShort;
        case 'dataLong':
            return BulkioDataType.dataLong;
        case 'dataLongLong':
            return BulkioDataType.dataLongLong;
        case 'dataULong' :
            return BulkioDataType.dataULong;
        case 'dataULongLong' :
            return BulkioDataType.dataULongLong;
        case 'dataFloat' :
            return BulkioDataType.dataFloat;
        case 'dataDouble' :
            return BulkioDataType.dataDouble;
        default:
            return BulkioDataType.UNKNOWN;
    }
}

export class BulkioPacket implements ISerializable<BulkioPacket> {
    streamID: string;
    T: PrecisionUTCTime;
    EOS: boolean;
    sriChanged: boolean;
    SRI: SRI;
    type: BulkioDataType;
    dataBuffer: Array<number>;

    deserialize(input: any) {
        this.streamID = input.streamID;
        this.T = new PrecisionUTCTime().deserialize(input.T);
        this.EOS = input.EOS;
        this.sriChanged = input.sriChanged;
        this.SRI = new SRI().deserialize(input.SRI);
        this.type = resolve(input.type);
        this.dataBuffer = input.dataBuffer;
        return this;
    }
}
