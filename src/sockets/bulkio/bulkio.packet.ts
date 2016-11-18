import { ISerializable } from '../../shared/serializable';

import { SRI } from './sri';
import { PrecisionUTCTime } from './precision.utc.time';

export type BulkioDataType = 
    'dataChar' |
    'dataShort' |
    'dataLong' |
    'dataLongLong' |
    'dataULong' |
    'dataULongLong' |
    'dataFloat' |
    'dataDouble';

export class BulkioPacket implements ISerializable<BulkioPacket> {
    streamID: string;
    T: PrecisionUTCTime;
    EOS: boolean;
    sriChanged: boolean;
    SRI: SRI;
    type: BulkioDataType;
    dataBuffer: Array<number>;

    deserialize(input: any) {
        this.streamID
        this.T = new PrecisionUTCTime().deserialize(input.T);
        this.EOS = input.EOS;
        this.sriChanged = input.sriChanged;
        this.SRI = new SRI().deserialize(input.SRI);
        this.type = input.type;
        this.dataBuffer = input.dataBuffer;
        return this;
    }
}
