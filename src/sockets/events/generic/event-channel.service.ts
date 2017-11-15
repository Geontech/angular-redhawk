import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// Why tslint is mad about this, I don't know.  It's used in the constructor.
// tslint:disable-next-line:no-unused-variable
import { map } from 'rxjs/operator/map';

// Models, URL service, and basic socket creator
import {
    OdmEvent,
    deserializeOdmEvent,
    IdmEvent,
    deserializeIdmEvent,
    RhMessage
} from '../../../models/index';
import { RestPythonService } from '../../../rest-python/rest-python.module';
import { basicSocket }          from '../../base/basic-socket';

// ECM command interface.
import { IEventChannelCommand } from './event-channel-command';

/**
 * The EventChannelService is a basic event channel interface.  You can
 * subscribe to any channel (WebSocket topics) based on domain ID.
 */
@Injectable()
export class EventChannelService {

    // All events and "send" interface
    private socketInterface: Subject<OdmEvent|IdmEvent|RhMessage|IEventChannelCommand>;

    /**
     * All events coming from this web socket
     */
    public get events$(): Observable<OdmEvent|IdmEvent|RhMessage> {
        return <any> this.socketInterface.asObservable();
    }

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
    }

    /**
     * @param restPython The REST Python service for mapping to the socket interface
     */
    constructor(restPython: RestPythonService) {
        this.socketInterface = <Subject<RhMessage|OdmEvent|IdmEvent>> basicSocket(restPython.eventSocketUrl())
            .map((response: MessageEvent): (RhMessage|OdmEvent|IdmEvent) => {
                let data: any = JSON.parse(response.data);
                if (data.hasOwnProperty('id') && data.hasOwnProperty('value')) {
                    let retval = new RhMessage().deserialize(data);
                    return retval;
                } else if (data.hasOwnProperty('sourceName')) {
                    let retval = deserializeOdmEvent(data);
                    return retval;
                } else if (data.hasOwnProperty('stateChangeFrom')) {
                    let retval = deserializeIdmEvent(data);
                    return retval;
                } else {
                    console.error('Event Received is not of a recognized type.');
                    return null;
                }
            });
    }
}
