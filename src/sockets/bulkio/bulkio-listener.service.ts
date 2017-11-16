import { Injectable, InjectionToken, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

import { BulkioPacket } from '../../models/index';

import { basicSocket } from '../base/basic-socket';

import { BulkioControl } from './bulkio-control';
import { ControlType } from './control-type';

type BulkioSocketTypes = BulkioPacket | BulkioControl;

export let BULKIO_SOCKET_URL = new InjectionToken<string>('bulkio.url');

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

    // The statistics on the most recent packet
    private _packetLength: number = 0;
    private _packetSubsize: number = 0;
    private _packetMode: number = 0;

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
     * The number of data words in the most recent packet.
     * @member {number}
     */
    public get packetLength(): number { return this._packetLength; }

    /**
     * The frame size of the most recent packet.
     *      0 - One dimensional data (no frames)
     *     >0 - Two dimensional data
     * @member {number}
     */
    public get packetSubsize(): number { return this._packetSubsize; }

    /**
     * The complex flag for the most recent packet.
     *     0 - Scalar data
     *     1 - Complex data
     * @member {number}
     */
    public get packetMode(): number { return this._packetMode; }

    /**
     * Set the max number of samples for the X axis (causes inter-sample
     * averaging).  The REST Python server will try to adjust to near this limit
     * based on the data size. Setting the width to less than or equal to 0 will
     * disable this feature.
     * @param {number} value
     */
    public set xMax(value: number) {
      if (this.socketInterface) {
         let msg: BulkioControl = {
             type: ControlType.xMax,
             value: value
         };
         this.socketInterface.next(msg);
      }
    }

    /**
     * Set the beginning index of the zoom region for the X axis. The index is
     * inclusive and based on data available at the UI (the server will adjust
     * the index for the actual packet size). The zoom will not be enabled until
     * the zoom level is set.
     * @param {number} value
     */
    public set xBegin(value: number) {
      if (this.socketInterface) {
         let msg: BulkioControl = {
             type: ControlType.xBegin,
             value: value
         };
         this.socketInterface.next(msg);
      }
    }

    /**
     * Set the ending index of the zoom region for the X axis. The index is
     * inclusive and based on data available at the UI (the server will adjust
     * the index for the actual packet size). The zoom will not be enabled until
     * the zoom level is set.
     * @param {number} value
     */
    public set xEnd(value: number) {
      if (this.socketInterface) {
         let msg: BulkioControl = {
             type: ControlType.xEnd,
             value: value
         };
         this.socketInterface.next(msg);
      }
    }

    /**
     * Command a zoom in on the X axis. Command will be executed
     * regardless of the value set.
     * @param {number} value
     */
    public set xZoomIn(value: number) {
      if (this.socketInterface) {
         let msg: BulkioControl = {
             type: ControlType.xZoomIn,
             value: value
         };
         this.socketInterface.next(msg);
      }
    }

    /**
     * Command a zoom reset on the X axis. Command will be executed
     * regardless of the value set.
     * @param {number} value
     */
    public set xZoomReset(value: number) {
      if (this.socketInterface) {
         let msg: BulkioControl = {
             type: ControlType.xZoomReset,
             value: value
         };
         this.socketInterface.next(msg);
      }
    }

    /**
     * Set the max number of samples for the Y axis (causes inter-sample
     * averaging).  The REST Python server will try to adjust to near this limit
     * based on the data size. Setting the width to less than or equal to 0 will
     * disable this feature.
     * @param {number} value
     */
    public set yMax(value: number) {
      if (this.socketInterface) {
         let msg: BulkioControl = {
             type: ControlType.yMax,
             value: value
         };
         this.socketInterface.next(msg);
      }
    }

    /**
     * Set the beginning index of the zoom region for the Y axis. The index is
     * inclusive and based on data available at the UI (the server will adjust
     * the index for the actual packet size). The zoom will not be enabled until
     * the zoom level is set.
     * @param {number} value
     */
    public set yBegin(value: number) {
      if (this.socketInterface) {
         let msg: BulkioControl = {
             type: ControlType.yBegin,
             value: value
         };
         this.socketInterface.next(msg);
      }
    }

    /**
     * Set the ending index of the zoom region for the Y axis. The index is
     * inclusive and based on data available at the UI (the server will adjust
     * the index for the actual packet size). The zoom will not be enabled until
     * the zoom level is set.
     * @param {number} value
     */
    public set yEnd(value: number) {
      if (this.socketInterface) {
         let msg: BulkioControl = {
             type: ControlType.yEnd,
             value: value
         };
         this.socketInterface.next(msg);
      }
    }

    /**
     * Command a zoom in on the Y axis. Command will be executed
     * regardless of the value set.
     * @param {number} value
     */
    public set yZoomIn(value: number) {
      if (this.socketInterface) {
         let msg: BulkioControl = {
             type: ControlType.yZoomIn,
             value: value
         };
         this.socketInterface.next(msg);
      }
    }

    /**
     * Command a zoom reset on the Y axis. Command will be executed
     * regardless of the value set.
     * @param {number} value
     */
    public set yZoomReset(value: number) {
      if (this.socketInterface) {
         let msg: BulkioControl = {
             type: ControlType.yZoomReset,
             value: value
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
                    this._packetLength = packet.dataBuffer.length;
                    this._packetSubsize = packet.SRI.subsize;
                    this._packetMode = packet.SRI.mode;
                    return packet;
                });
            this.socketSubscription = this.socketInterface
                .subscribe((packet: BulkioSocketTypes) => this.packet.next(<BulkioPacket> packet));
        } else {
            console.error('No URL provided for websocket!');
        }
    }

    /**
     * Disconnect from the BULKIO socket.
     */
    public disconnect(): void {
        if (this.socketSubscription) {
            this.socketSubscription.unsubscribe();
        }

        if (this.socketInterface) {
            this.socketInterface.complete();
        }
        this.socketInterface = null;
        this.socketSubscription = null;
        this._deserializeTime = 0;
    }

    /**
     * @param {string} url - The base URL (ws:// or wss://) of the port
     */
    constructor(@Inject(BULKIO_SOCKET_URL) url: string) {
        this._url = url;
        this.packet = new Subject<BulkioPacket>();
        this.disconnect();
    }
}
