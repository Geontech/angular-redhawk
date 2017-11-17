import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// Why tslint is mad about this, I don't know.  It's used in the constructor.
// tslint:disable-next-line:no-unused-variable
import { map } from 'rxjs/operator/map';

import { RedhawkEvent } from '../models/index';
import { RestPythonService } from '../rest-python/rest-python.module';

import { basicSocket } from './base/basic-socket';

/**
 * The REDHAWK Listener Service provides notifications for when Domains are
 * added and removed to the naming service.
 */
@Injectable()
export class RedhawkListenerService {

    /** Internal subject for received messages */
    private socketInterface: Subject<RedhawkEvent>;

    /**
     * Observable event indicating which domains were added and removed as well as 
     * the current listing of Domains.
     */
    public get events$(): Observable<RedhawkEvent> {
        return this.socketInterface.asObservable();
    }

    /**
     * Constructor
     * @param restPython The REST Python service that provides the URL mapping to REST Python
     */
    constructor(restPython: RestPythonService) {
        this.socketInterface = <Subject<RedhawkEvent>> basicSocket(restPython.redhawkSocketUrl())
            .map((response: MessageEvent): RedhawkEvent => {
                return new RedhawkEvent().deserialize(JSON.parse(response.data));
            });
    }
}
