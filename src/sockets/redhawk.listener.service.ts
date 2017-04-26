import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// Why tslint is mad about this, I don't know.  It's used in the constructor.
// tslint:disable-next-line:no-unused-variable
import { map } from 'rxjs/operator/map';

import { basicSocket } from './basic.socket';
import { RedhawkSocketUrl } from '../shared/config.service';

import { RedhawkEvent } from '../redhawk/redhawk';

@Injectable()
export class RedhawkListenerService {

    // Internal subject for received messages
    private socketInterface: Subject<RedhawkEvent>;

    public getEvents$(): Observable<RedhawkEvent> {
        return this.socketInterface.asObservable();
    }

    // Constructor
    constructor() {
        this.socketInterface = <Subject<RedhawkEvent>> basicSocket(RedhawkSocketUrl())
            .map((response: MessageEvent): RedhawkEvent => {
                return new RedhawkEvent().deserialize(JSON.parse(response.data));
            });
    }
}
