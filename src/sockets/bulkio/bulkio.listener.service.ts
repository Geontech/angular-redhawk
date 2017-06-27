import { Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

import { basicSocket } from '../basic.socket';

import { BulkioPacket } from './bulkio.packet';
import { BulkioControl, ControlType } from './bulkio.control';

type BulkioSocketTypes = BulkioPacket | BulkioControl;


@Injectable()
export class BulkioListenerService {

    // Internal packet relay and socket interface
    private packet: Subject<BulkioPacket>;
    private socketInterface: Subject<BulkioSocketTypes>;
    private socketSubscription: Subscription;

    // The amount of time deserializing a packet took.
    private deserializeTime: number = 0;

    /**
     * Subscribe to receive the bulkio packets.
     * @member {Observable<BulkioPacket>} 
     */
    public getPacket$(): Observable<BulkioPacket> {
        return <Observable<BulkioPacket>> this.packet.asObservable();
    }

    /**
     * The amount of time it took to deserialize the most recent packet.
     * @member {number}
     */
    public getDeserializeTime(): number { return this.deserializeTime; }

    /**
     * Set the output data width
     * @param {number} width - The maximum "width" of the data stream (< 0 to disable)
     */
    public setDataWidth(width: number): void {
        if (this.socketInterface) {
            let msg: BulkioControl = {
                type: ControlType.MaxWidth,
                value: width
            };
            this.socketInterface.next(msg);
        }
    }

    /**
     * Set the (maximum) socket data rate (packets per second)
     * @param {number} pps - The (maximum) number of packets per second to receive (< 0 to disable)
     */
    public setPacketsPerSecond(pps: number): void {
        if (this.socketInterface) {
            let msg: BulkioControl = {
                type: ControlType.MaxPPS,
                value: pps
            };
            this.socketInterface.next(msg);
        }
    }

    /**
     * Returns whether the service is already connected.
     * @return {boolean} True: WebSocket is connected, False: it is not.
     */
    public isConnected(): boolean { return this.socketSubscription != null; }

    /**
     * Returns whether anything is actually subscribed to receive packets.
     * @return {boolean} True: Subscribers are present, False: No subscribers.
     */
    public isActive(): boolean { return !this.packet.isStopped; }

    /**
     * Connect to the BULKIO socket at the url.
     */
    public connect(connection_id?: string): void {
        this.disconnect();
        if (this.url) {
            let connectionUrl: string = this.url;
            if (connection_id) {
                connectionUrl += '/' + connection_id;
            }
            this.socketInterface = <Subject<BulkioSocketTypes>> basicSocket(connectionUrl)
                .map((response: MessageEvent): BulkioSocketTypes => {
                    let d = new Date();
                    let start: number = d.getTime();
                    let data: any = JSON.parse(response.data);
                    let packet =  new BulkioPacket().deserialize(data);
                    let end: number = d.getTime();
                    this.deserializeTime = end - start;
                    return packet;
                });
            this.socketSubscription = this.socketInterface
                .subscribe((packet: BulkioSocketTypes) => this.packet.next(<BulkioPacket> packet));
        } else {
            console.error('No URL provided for websocket!');
        }
    }

    /**
     * Disconnect from the websocket
     */
    public disconnect(): void {
        if (this.isConnected()) {
            // Close the websocket by unsubscribing, and clear the interfaces.
            this.socketSubscription.unsubscribe();
            this.socketInterface = null;
            this.socketSubscription = null;
            this.deserializeTime = 0;
        }
    }

    /**
     * @param {string} url - The base URL (ws:// or wss://) of the port
     */
    constructor(private url: string) {
        this.packet = new Subject<BulkioPacket>();
    }
}
