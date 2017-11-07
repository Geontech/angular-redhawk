import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

import { BulkioPacket } from '../../models/index';

import { basicSocket } from '../base/basic-socket';

import { BulkioControl } from './bulkio-control';
import { ControlType } from './control-type';

type BulkioSocketTypes = BulkioPacket | BulkioControl;


@Injectable()
export class BulkioListenerService {
    /** The URL of the bulkio websocket */
    private _url: string;

    /** The most recent connection ID */
    private _connectionId: string;

    // Internal packet relay and socket interface
    private packet: Subject<BulkioPacket>;
    private socketInterface: Subject<BulkioSocketTypes>;
    private socketSubscription: Subscription;

    // The amount of time deserializing a packet took.
    private _deserializeTime: number = 0;

    /** Set the URL.  If connected, this will disconnect and reconnect */
    public set url(url: string) {
        this._url = url;
        if (this.connected) {
            this.disconnect();
            this.connect(this._connectionId);
        }
    }

    /** Get the current URL */
    public get url(): string { return this._url; }

    /**
     * Subscribe to receive the bulkio packets.
     * @member {Observable<BulkioPacket>} 
     */
    public get packet$(): Observable<BulkioPacket> {
        return <Observable<BulkioPacket>> this.packet.asObservable();
    }

    /**
     * The amount of time it took to deserialize the most recent packet.
     * @member {number}
     */
    public get deserializeTime(): number { return this._deserializeTime; }

    /**
     * Set the output data width
     * @param {number} width - The maximum "width" of the data stream (< 0 to disable)
     */
    public set dataWidth(width: number) {
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
    public set packetsPerSecond(pps: number) {
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
    public get connected(): boolean { return this.socketSubscription != null; }

    /**
     * Returns whether anything is actually subscribed to receive packets.
     * @return {boolean} True: Subscribers are present, False: No subscribers.
     */
    public get active(): boolean { return !this.packet.isStopped; }

    /**
     * Connect to the BULKIO socket at the url.
     */
    public connect(connectionId?: string): void {
        this.disconnect();
        if (this.url) {
            this._connectionId = connectionId;
            let connectionUrl   = this.url;
            if (this._connectionId) {
                connectionUrl += '/' + this._connectionId;
            }
            this.socketInterface = <Subject<BulkioSocketTypes>> basicSocket(connectionUrl)
                .map((response: MessageEvent): BulkioSocketTypes => {
                    let d = new Date();
                    let start: number = d.getTime();
                    let data: any = JSON.parse(response.data);
                    let packet =  new BulkioPacket().deserialize(data);
                    let end: number = d.getTime();
                    this._deserializeTime = end - start;
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
        if (this.connected) {
            // Close the websocket by unsubscribing, and clear the interfaces.
            this.socketSubscription.unsubscribe();
            this.socketInterface = null;
            this.socketSubscription = null;
            this._deserializeTime = 0;
        }
    }

    /**
     * @param {string} url - The base URL (ws:// or wss://) of the port
     */
    constructor(url: string) {
        this._url = url;
        this.packet = new Subject<BulkioPacket>();
    }
}
