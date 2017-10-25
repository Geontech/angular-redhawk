import { ControlType } from './control-type';

/**
 * BULKIO Control Message format
 * @interface
 * @property {ControlType} type - The type of control requested.
 * @property {number} value - The adjustment to make.  @see {@link ControlType}.
 */
export interface BulkioControl {
    type: ControlType;
    value: number;
}
