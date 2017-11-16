import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

import { BulkioPacket } from '../../models/index';

import { PortRef } from './port.ref';

import { BulkioListenerService } from '../../sockets/sockets.module';

import {
    RestPythonService
} from '../../rest-python/rest-python.module';

/**
 * The PortReceiver interface receives BulkioPacket pushes from
 * the bulkio port service.
 */
export interface PortReceiver {
    (packet: BulkioPacket): void;
}

/**
 * @class
 * BulkioRef is akin to the internal "ref" member found in the Python Shell.
 */
export class BulkioRef extends PortRef {
    private connectionId: string;
    private bulkioService: BulkioListenerService;

    /**
     * Connect to the packet stream of the bulkio service listener
     * @param {PortReceiver} target - The callback for when new packets are received.
     * @param {string} connection_id - The connection_id (stream_id), if applicable.
     * @return {Subscription} The RxJS Subscription for this connection.
     */
    connectPort(target: PortReceiver, connection_id?: string): Subscription {
        if (connection_id !== this.connectionId) {
            this.disconnectPort();
        }
        if (!this.bulkioService.connected) {
            this.bulkioService.connect(connection_id);
            this.connectionId = connection_id;
        }
        return this.bulkioService.packet$.subscribe(target);
    }

    /**
     * Disconnect this connection.
     * NOTE: This is equivalent call unsubscribe() on the Subscription and
     *       also disconnects the service from the server.
     * @param {Subscription} connection - The connection (subscription) returned
     *     from the connectPort call.
     */
    disconnectPort(connection?: Subscription) {
        if (connection) {
            connection.unsubscribe();
        }
        this.bulkioService.disconnect();
    }

    /**
     * Set the max number of samples for the X axis (causes inter-sample
     * averaging).  The REST Python server will try to adjust to near this limit
     * based on the data size. Setting the width to less than or equal to 0 will
     * disable this feature.
     * @param {number} value
     */
    set xMax(value: number) { this.bulkioService.xMax = value; }

    /**
     * Set the beginning index of the zoom region for the X axis. The index is
     * inclusive and based on data available at the UI (the server will adjust
     * the index for the actual packet size). The zoom will not be enabled until
     * the zoom level is set.
     * @param {number} value
     */
    set xBegin(value: number) { this.bulkioService.xBegin = value; }

    /**
     * Set the ending index of the zoom region for the X axis. The index is
     * inclusive and based on data available at the UI (the server will adjust
     * the index for the actual packet size). The zoom will not be enabled until
     * the zoom level is set.
     * @param {number} value
     */
    set xEnd(value: number) { this.bulkioService.xEnd = value; }

    /**
     * Command a zoom in on the X axis. Command will be executed
     * regardless of the value set.
     * @param {number} value
     */
    set xZoomIn(value: number) { this.bulkioService.xZoomIn = value; }

    /**
     * Command a zoom reset on the X axis. Command will be executed
     * regardless of the value set.
     * @param {number} value
     */
    set xZoomReset(value: number) { this.bulkioService.xZoomReset = value; }

    /**
     * Set the max number of samples for the Y axis (causes inter-sample
     * averaging).  The REST Python server will try to adjust to near this limit
     * based on the data size. Setting the width to less than or equal to 0 will
     * disable this feature.
     * @param {number} value
     */
    set yMax(value: number) { this.bulkioService.yMax = value; }

    /**
     * Set the beginning index of the zoom region for the Y axis. The index is
     * inclusive and based on data available at the UI (the server will adjust
     * the index for the actual packet size). The zoom will not be enabled until
     * the zoom level is set.
     * @param {number} value
     */
    set yBegin(value: number) { this.bulkioService.yBegin = value; }

    /**
     * Set the ending index of the zoom region for the Y axis. The index is
     * inclusive and based on data available at the UI (the server will adjust
     * the index for the actual packet size). The zoom will not be enabled until
     * the zoom level is set.
     * @param {number} value
     */
    set yEnd(value: number) { this.bulkioService.yEnd = value; }

    /**
     * Command a zoom in on the Y axis. Command will be executed
     * regardless of the value set.
     * @param {number} value
     */
    set yZoomIn(value: number) { this.bulkioService.yZoomIn = value; }

    /**
     * Command a zoom reset on the Y axis. Command will be executed
     * regardless of the value set.
     * @param {number} value
     */
    set yZoomReset(value: number) { this.bulkioService.yZoomReset = value; }

    /**
     * Set the data update rate of the connection.  This is a maximum update
     * rate and may be approximated.  Setting the value to less than or equal
     * to zero disables this feature (i.e., lets the service push as quickly
     * as the socket and server will allow).
     * @param {number} pps - The maximum number of packets per second to receive.
     */
    set packetsPerSecond(pps: number) {
        this.bulkioService.packetsPerSecond = pps;
    }

    /**
     * Statistic indicating how long it took to deserialize the packet.
     * @return {number} The time required to deserialize the BulkioPacket
     */
    get deserializeTime(): number {
        return this.bulkioService.deserializeTime;
    }

    /**
     * The number of data words in the most recent packet.
     * @return {number}
     */
    get packetLength(): number {
        return this.bulkioService.packetLength;
    }

    /**
     * The frame size of the most recent packet.
     *      0 - One dimensional data (no frames)
     *     >0 - Two dimensional data
     * @return {number}
     */
    get packetSubsize(): number {
        return this.bulkioService.packetSubsize;
    }

    /**
     * The complex flag for the most recent packet.
     *     0 - Scalar data
     *     1 - Complex data
     * @return {number}
     */
    get packetMode(): number {
        return this.bulkioService.packetMode;
    }

    release(): void {
        this.bulkioService.disconnect();
        super.release();
    }

    constructor(public url: string, rp: RestPythonService) {
        super(url);
        this.bulkioService = new BulkioListenerService(rp.bulkioSocketUrl(url));
    }
}
