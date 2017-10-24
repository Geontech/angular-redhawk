import { ISerializable } from '../serialization/index';

import { Keywords, deserializeKeywords } from './keyword';

/**
 * Serializable REDHAWK SRI (Signal Related Information) Structure
 */
export class SRI implements ISerializable<SRI> {
    hversion: number;
    xstart: number;
    xdelta: number;
    xunits: number;
    subsize: number;
    ystart: number;
    ydelta: number;
    yunits: number;
    mode: number;
    streamID: string;
    blocking: boolean;
    keywords: Keywords;

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
