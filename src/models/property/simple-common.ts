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
     * Common string-to-value (data)type conversion.
     * @param val Value to convert (string)
     * @param type Data type (string, long, ulong, etc.)
     */
    static valueFromString(val: string, type: string): any {
        let value: any = val;
        switch (type) {
            case 'long':
            case 'ulong':
            case 'longlong':
            case 'ulonglong':
            case 'short':
            case 'ushort':
            case 'octet':
            case 'float':
            case 'double':
                // Not a typo, converts to a number
                value = +val;
                break;
            case 'boolean':
                value = val.toLowerCase() === 'true' ? true : false;
                break;
            case 'string':
            case 'char':
                break;
            default:
                console.warn(`Unknown data type (${type}); treating as string.`);
                value = '' + val;
                break;
        }
        return value;
    }

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
