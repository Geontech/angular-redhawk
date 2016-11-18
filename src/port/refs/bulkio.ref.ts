import { Optional, ReflectiveInjector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

import { PortRef } from './port.ref';

import {
    BulkioListenerService,
    BulkioPacket
} from '../../sockets/sockets.module';

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
    private bulkioService: BulkioListenerService;

    /**
     * Connect to the packet stream of the bulkio service listener
     * @param {PortReceiver} target - The callback for when new packets are received.
     * @return {Subscription} The RxJS Subscription for this connection.
     */
    connectPort(target: PortReceiver): Subscription {
        if (!this.bulkioService.connected) {
            this.bulkioService.connect(this.url);
        }
        return this.bulkioService.packet$.subscribe(target);
    }

    /**
     * Disconnect this connection.
     * NOTE: This is equivalent call unsubscribe() on the Subscription
     * @param {Subscription} connection - The connection (subscription) returned
     *     from the connectPort call.
     */
    disconnectPort(connection?: Subscription) {
        if (connection) {
            connection.unsubscribe();
        }
        if (!this.bulkioService.active) {
            // If nothing is subscribed, close the socket too.
            this.bulkioService.disconnect();
        }
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
    public setPacketsPerSecond(pps: number): void {
        this.bulkioService.setPacketsPerSecond(pps);
    }

    release(): void {
        this.bulkioService.disconnect();
        super.release();
    }

    constructor(public url: string) {
        super(url);
        /**
         * Get this injector parent, which is likely the PortService, then
         * have the parent resolve and create a child of the listener service.
         * This should allow DI to inject this PortService into this newly
         * minted BulkioListenerService and cache that provider for down-stream
         * DI (like a plotter view inside a div with arPort on it, which
         * would have instantiated the PortService).
         */
        let parent = ReflectiveInjector.resolveAndCreate([]);
        let injector = parent.resolveAndCreateChild([BulkioListenerService]);
        this.bulkioService = injector.get(BulkioListenerService);
    }
}
