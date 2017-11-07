import { ISerializable } from '../serialization/index';

/**
 * Serializable REDHAWK BULKIO Precision UTC Time model
 */
export class PrecisionUTCTime implements ISerializable<PrecisionUTCTime> {
    tcmode: number;
    tcstatus: number;
    toff: number;
    twsec: number;
    tfsec: number;

    deserialize(input: any) {
        this.tcmode = input.tcmode;
        this.tcstatus = input.tcstatus;
        this.toff = input.toff;
        this.twsec = input.twsec;
        this.tfsec = input.tfsec;
        return this;
    }
}