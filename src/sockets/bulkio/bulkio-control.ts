import { ControlType } from './control-type';

/**
 * BULKIO Control Message format
 * @property {ControlType} type - The type of control requested.
 * @property {number} value - The adjustment to make.
 */
export interface BulkioControl {
    /** The 'type' (feature) To control */
    type: ControlType;
    /** The parameter setting for the feature */
    value: number;
}
