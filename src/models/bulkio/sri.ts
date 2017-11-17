import { ISerializable } from '../serialization/index';

import { Keywords, deserializeKeywords } from './keyword';

/**
 * Serializable REDHAWK SRI (Signal Related Information) Structure
 */
export class SRI implements ISerializable<SRI> {
    /** Stream SRI Header Version*/
    hversion: number;
    /** Start of primary axis  */
    xstart: number;
    /** Interval along primary axis */
    xdelta: number;
    /** Units associated with primary axis */
    xunits: number;
    /** For contiguous data, 0, otherwise specifies number of elements in each frame */
    subsize: number;
    /** Start of secondary axis */
    ystart: number;
    /** Interval along secondary axis */
    ydelta: number;
    /** Units associated with secondary axis */
    yunits: number;
    /** 0 - Scalar, 1 - Complex (I, Q sequence, [I1, Q1, I2, Q2, ...]) */
    mode: number;
    /** Stream ID */
    streamID: string;
    /** Flag specifying how the receiving port should handle overflows */
    blocking: boolean;
    /** Sequence of stream Keywords */
    keywords: Keywords;

    /** Deserializes a JSON object into this class */
    deserialize(input: any) {
        this.hversion = input.hversion;
        this.xstart = input.xstart;
        this.xdelta = input.xdelta;
        this.xunits = input.xunits;
        this.subsize = input.subsize;
        this.ystart = input.ystart;
        this.ydelta = input.ydelta;
        this.yunits = input.yunits;
        this.mode = input.mode;
        this.streamID = input.streamID;
        this.blocking = input.blocking;
        this.keywords = deserializeKeywords(input.keywords);
        return this;
    }
}
