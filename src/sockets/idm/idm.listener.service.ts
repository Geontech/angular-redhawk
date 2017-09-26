import {
    Injectable,
    ReflectiveInjector,
    Optional
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { EventChannelService } from '../event.channel.service';

import { IdmEvent, isIdmEvent } from './idm.event.base';
import { UsageStateEvent, isUsageStateEvent } from './usage.state.event';
import { AdministrativeStateEvent, isAdministrativeStateEvent } from './administrative.state.event';
import { OperationalStateEvent, isOperationalStateEvent } from './operational.state.event';
import { AbnormalComponentTerminationEvent, isAbnormalComponentTerminationEvent } from './abnormal.component.termination.event';

export function configureIdmListenerService(ecs: EventChannelService): IdmListenerService {
    const s = new IdmListenerService(ecs);
    return s;
}

export function idmListenerServiceProvider(): any {
    return [
        EventChannelService,
        {
            provide: IdmListenerService,
            useFactory: configureIdmListenerService,
            deps: [ EventChannelService ]
        }
    ];
}

/**
 * The IdmListenerService is similar to the IDMListener in the REDHAWK sandbox.
 */
@Injectable()
export class IdmListenerService {

    public getAllEvents$(): Observable<IdmEvent> {
        return this.allEvents.asObservable();
    }
    public getAdministrativeStateChanged$(): Observable<AdministrativeStateEvent> {
        return this.administrativeStateChanged.asObservable();
    }
    public getOperationalStateChanged$(): Observable<OperationalStateEvent> {
        return this.operationalStateChanged.asObservable();
    }
    public getUsageStateChanged$(): Observable<UsageStateEvent> {
        return this.usageStateChanged.asObservable();
    }
    public getAbnormalComponentTerminationChanged$(): Observable<AbnormalComponentTerminationEvent> {
        return this.abnormalComponentTerminationChanged.asObservable();
    }

    // All events
    private allEvents: Subject<IdmEvent>;

    // Administrative, Operational, and Usage State events
    private administrativeStateChanged: Subject<AdministrativeStateEvent>;
    private operationalStateChanged: Subject<OperationalStateEvent>;
    private usageStateChanged: Subject<UsageStateEvent>;
    private abnormalComponentTerminationChanged: Subject<AbnormalComponentTerminationEvent>;

    public connect(domainId: string) {
        this.eventChannel.connect(domainId, 'IDM_Channel');
    }

    public disconnect(domainId: string) {
        this.eventChannel.disconnect(domainId, 'IDM_Channel');
    }

    constructor(private eventChannel: EventChannelService) {

        this.allEvents = new Subject<IdmEvent>();
        this.administrativeStateChanged = new Subject<AdministrativeStateEvent>();
        this.operationalStateChanged = new Subject<OperationalStateEvent>();
        this.usageStateChanged = new Subject<UsageStateEvent>();
        this.abnormalComponentTerminationChanged = new Subject<AbnormalComponentTerminationEvent>();

        this.eventChannel
            .getEvents$()
            .subscribe((data: any) => {
                if (isIdmEvent(data)) {
                    this.allEvents.next(data);
                    if (isAdministrativeStateEvent(data)) {
                        this.administrativeStateChanged.next(data);
                    } else if (isOperationalStateEvent(data)) {
                        this.operationalStateChanged.next(data);
                    } else if (isUsageStateEvent(data)) {
                        this.usageStateChanged.next(data);
                    } else if (isAbnormalComponentTerminationEvent(data)) {
                        this.abnormalComponentTerminationChanged.next(data);
                    }
                }
            });
    }
}
