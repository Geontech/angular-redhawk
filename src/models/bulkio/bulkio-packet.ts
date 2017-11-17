import { ISerializable } from '../serialization/index';
import { BulkioDataType } from './enums/index';

import { SRI } from './sri';
import { PrecisionUTCTime } from './precision-utc-time';

/**
 * Serializable REDHAWK BULKIO Packet model
 */
export class BulkioPacket implements ISerializable<BulkioPacket> {
    /** Stream ID */
    streamID: string;
    /** Precision Time Stamp */
    T: PrecisionUTCTime;
    /** End of Stream (EOS) flag */
    EOS: boolean;
    /** Flag for if the SRI has changed */
    sriChanged: boolean;
    /**  The Signal Related Information (SRI) structure */
    SRI: SRI;
    /** The Data Type of the buffer */
    type: BulkioDataType;
    /** The data buffer of the stream */
    dataBuffer: Array<number>;

    /** Deserializes a JSON object into this class */
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

function resolve(dataType: string): BulkioDataType {
    switch (dataType) {
        // case 'dataOctet':
        //     return BulkioDataType.dataOctet;
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
