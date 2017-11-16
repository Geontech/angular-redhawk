/**
 * Control enumeration
 * @readonly
 * @enum {number}
 */
export enum ControlType {
    /**
    * ==========================================================================
    * X DIMENSION
    * ==========================================================================
    */
    /**
     * Adjusts the maximum "width" of the incoming data, forcing a neighbor-mean
     * at the server to reduce the amount of data received at the client.
     * If `value` is positive, the server will attempt to accommodate that width
     * of data.  Setting `value` to 0 or a negative value disables this feature.
     */
    xMax = 0,

    /**
     * Sets the beginning index for a zoom function. The indices are inclusive,
     * and they are based on the data received at the UI, meaning they are based
     * on data that is more than likely down-sampled. The server adjusts the
     * indices for the actual packet size. This parameter does not take effect
     * until the zoom level is set greater than 0.
     */
    xBegin = 1,

    /**
     * Sets the ending index for a zoom function. The indices are inclusive,
     * and they are based on the data received at the UI, meaning they are based
     * on data that is more than likely down-sampled. The server adjusts the
     * indices for the actual packet size. This parameter does not take effect
     * until the zoom level is set greater than 0.
     */
    xEnd = 2,

    /**
     * Commands a zoom-in with the current xBegin and xEnd. The value does not
     * matter since issuing the command will trigger the zoom in.
     */
    xZoomIn = 3,

    /**
     * Commands a zoom reset to remove xBegin and xEnd. The value does not
     * matter since issuing the command will trigger the zoom reset.
     */
    xZoomReset = 4,

    /**
    * ==========================================================================
    * Y DIMENSION
    * ==========================================================================
    */
    /**
     * Adjusts the maximum "width" of the incoming data, forcing a neighbor-mean
     * at the server to reduce the amount of data received at the client.
     * If `value` is positive, the server will attempt to accommodate that width
     * of data.  Setting `value` to 0 or a negative value disables this feature.
     */
    yMax = 5,

    /**
     * Sets the beginning index for a zoom function. The indices are inclusive,
     * and they are based on the data received at the UI, meaning they are based
     * on data that is more than likely down-sampled. The server adjusts the
     * indices for the actual packet size. This parameter does not take effect
     * until the zoom level is set greater than 0.
     */
    yBegin = 6,

    /**
     * Sets the ending index for a zoom function. The indices are inclusive,
     * and they are based on the data received at the UI, meaning they are based
     * on data that is more than likely down-sampled. The server adjusts the
     * indices for the actual packet size. This parameter does not take effect
     * until the zoom level is set greater than 0.
     */
    yEnd = 7,

    /**
     * Commands a zoom-in with the current yBegin and yEnd. The value does not
     * matter since issuing the command will trigger the zoom in.
     */
    yZoomIn = 8,

    /**
     * Commands a zoom reset to remove yBegin and yEnd. The value does not
     * matter since issuing the command will trigger the zoom reset.
     */
    yZoomReset = 9,

    /**
     * Controls the maximum number of packets per second sent by the server.
     * This reduces the amount of data received at the client by dropping
     * bulkio messages at the server.
     *
     * Only positive numbers are interpreted.
     *
     * This does not guarantee the server will achieve this maximum.
     */
    MaxPPS = 10
}
