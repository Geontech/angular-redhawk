import { ISerializable } from '../serialization/index';

/**
 * Serializable REDHAWK BULKIO Precision UTC Time model
 */
export class PrecisionUTCTime implements ISerializable<PrecisionUTCTime> {
    /** Time Code mode */
    tcmode: number;
    /** Time Code status */
    tcstatus: number;
    /** Fractional sample offset */
    toff: number;
    /** Number of seconds since 12 AM 1 January 1970 */
    twsec: number;
    /** Number of fractional seconds (0.0 to 1.0) to add to twsec */
    tfsec: number;

    /** Deserializes a JSON object into this class */
    deserialize(input: any) {
        this.tcmode = input.tcmode;
        this.tcstatus = input.tcstatus;
        this.toff = input.toff;
        this.twsec = input.twsec;
        this.tfsec = input.tfsec;
        return this;
    }
}
