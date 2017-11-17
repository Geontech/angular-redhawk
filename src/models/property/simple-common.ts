import { Property } from './property';

/**
 * Common base class for Simple and SimpleSeq types which have
 * the ability to express values as enumerations
 */
export class SimpleCommon extends Property {
    /** The data type of the value */
    type:         string;
    /** Enumeration map related to the value, if any */
    enumerations: { [key: string]: string };

    /**
     * Create a copy of the property
     */
    copy(): SimpleCommon {
        let p = new SimpleCommon().deserialize(this);
        p.kinds = (this.kinds instanceof Array) ? this.kinds.slice() : this.kinds;
        p.type = this.type;
        // Copy the map if it exists
        if (this.enumerations !== undefined) {
            p.enumerations = {};
            for (let i in this.enumerations) {
                if (this.enumerations.hasOwnProperty(i)) {
                    p.enumerations[i] = this.enumerations[i];
                }
            }
        }
        return p;
    }
}
