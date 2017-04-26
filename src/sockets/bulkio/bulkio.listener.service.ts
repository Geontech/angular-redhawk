import { Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

import { BulkioSocketUrl } from '../../shared/config.service';
import { PortService } from '../../port/port.service';

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
    private _deserializeTime: number = 0;

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
    public getDeserializeTime(): number { return this._deserializeTime; }

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
     * Connect to the BULKIO socket at the url.  The URL is optional and takes
     * precedence over the PortService if one was provided.
     * @param {string} url - The URL (ws://...) of the BULKIO websocket interface
     */
    public connect(url?: string): void {
        this.disconnect();

        // Decide which URL to use
        let target: string = url || this.getServiceUrl();
        if (target) {
            this.socketInterface = <Subject<BulkioSocketTypes>> basicSocket(target)
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
        if (this.isConnected()) {
            // Close the websocket by unsubscribing, and clear the interfaces.
            this.socketSubscription.unsubscribe();
            this.socketInterface = null;
            this.socketSubscription = null;
            this._deserializeTime = 0;
        }
    }

    constructor(@Optional() private portService: PortService) {
        this.packet = new Subject<BulkioPacket>();
    }

    private getServiceUrl(): string {
        if (this.portService) {
            return BulkioSocketUrl(this.portService.getBaseUrl());
        }
        return null;
    }
}
