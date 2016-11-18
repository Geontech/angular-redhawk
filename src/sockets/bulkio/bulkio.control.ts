/**
 * Control enumeration
 * @readonly
 * @enum {number}
 */
export enum ControlType {
    /**
     * Adjusts the maximum "width" of the incoming data, forcing a neighbor-mean
     * at the server to reduce the amount of data received at the client.
     * If `value` is positive, the server will attempt to accomodate that width
     * of data.  Setting `value` to a negative value disables this feature.
     */
    MaxWidth = 0,

    /**
     * Controls the maximum number of packets per second sent by the server.
     * This reduces the amount of data received at the client by dropping 
     * bulkio messages at the server.
     *
     * Only positive numbers are interpreted.
     *
     * This does not guarantee the server will achieve this maximum.
     */
    MaxPPS = 1
}

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
