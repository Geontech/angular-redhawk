import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

import { PortRef } from './port.ref';

import {
    BulkioListenerService,
    BulkioPacket
} from '../../sockets/sockets.module';

import {
    RestPythonService
} from '../../shared/rest.python.service';

/**
 * @interface
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
        if (!this.bulkioService.isConnected()) {
            this.bulkioService.connect(connection_id);
            this.connectionId = connection_id;
        }
        return this.bulkioService.getPacket$().subscribe(target);
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
     * Set the data width limit (causes inter-sample averaging).  The REST Python
     * server will try to adjust to near this limit based on the data size.
     * Setting the width to less than or equal to 0 will disable this feature.
     * @param {number} width - Desired data width.
     */
    setDataWidth(width: number): void { this.bulkioService.setDataWidth(width); }

    /**
     * Set the data update rate of the connection.  This is a maximum update
     * rate and may be approximated.  Setting the value to less than or equal
     * to zero disables this feature (i.e., lets the service push as quickly
     * as the socket and server will allow).
     * @param {number} pps - The maximum number of packets per second to receive.
     */
    setPacketsPerSecond(pps: number): void {
        this.bulkioService.setPacketsPerSecond(pps);
    }

    /**
     * Statistic indicating how long it took to deserialize the packet.
     * @return {number} The time required to deserialize the BulkioPacket
     */
    getDeserializeTime(): number {
        return this.bulkioService.getDeserializeTime();
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
