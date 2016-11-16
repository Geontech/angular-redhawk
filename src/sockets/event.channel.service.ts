import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// Why tslint is mad about this, I don't know.  It's used in the constructor.
// tslint:disable-next-line:no-unused-variable
import { map } from 'rxjs/operator/map';

import { basicSocket } from './basic.socket';

import { EventSocketUrl } from '../shared/config.service';
import { IEventChannelCommand } from './event.channel.command';

import { RhMessage } from './message/message';

/**
 * The EventChannelService is a basic event channel interface.  You can
 * subscribe to any channel (WebSocket topics) based on domain ID.
 */
@Injectable()
export class EventChannelService {

    /**
     * All events coming from this web socket
     */
    public get events$(): Observable<any|RhMessage> { return this.socketInterface.asObservable(); }

    // All events and "send" interface
    private socketInterface: Subject<any|RhMessage|IEventChannelCommand>;

    /**
     * Connects to the named event channel per the provided domain ID
     * @param {string} domainId The Domain ID for the event channel
     * @param {string} channelName The event channel to listen to
     */
    public connect(domainId: string, channelName: string) {
        let cmd: IEventChannelCommand = {
            command: 'ADD',
            domainId: domainId,
            topic: channelName
        };
        this.socketInterface.next(cmd);
    }

    /**
     * Disconnects from the named event channel per the provided domain ID
     * @param {string} domainId The Domain ID for the event channel
     * @param {string} channelName The event channel to stop listening to
     */
    public disconnect(domainId: string, channelName: string) {
        let cmd: IEventChannelCommand = {
            command: 'REMOVE',
            domainId: domainId,
            topic: channelName
        };
        this.socketInterface.next(cmd);
    }

    /**
     * FUTURE USE
     */
    public send(payload: Object) {
        alert('This method is reserved for future use.');
        // this.socketInterface.next(payload);
    }

    constructor() {
        this.socketInterface = <Subject<any|RhMessage>> basicSocket(EventSocketUrl())
            .map((response: MessageEvent): (any | RhMessage) => {
                let data: any = JSON.parse(response.data);
                if (data.hasOwnProperty('id') && data.hasOwnProperty('value')) {
                    return new RhMessage().deserialize(data);
                }
                return data;
            });
    }
}
