import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import {
    IdmEvent,
    UsageStateEvent,
    AdministrativeStateEvent,
    OperationalStateEvent,
    AbnormalComponentTerminationEvent
} from '../../../models';

import { EventChannelService } from '../generic/index';

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

    public get allEvents$(): Observable<IdmEvent> {
        return this.allEvents.asObservable();
    }
    public get administrativeStateChanged$(): Observable<AdministrativeStateEvent> {
        return this.administrativeStateChanged.asObservable();
    }
    public get operationalStateChanged$(): Observable<OperationalStateEvent> {
        return this.operationalStateChanged.asObservable();
    }
    public get usageStateChanged$(): Observable<UsageStateEvent> {
        return this.usageStateChanged.asObservable();
    }
    public get abnormalComponentTerminationChanged$(): Observable<AbnormalComponentTerminationEvent> {
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
            .events$
            .subscribe((data: any) => {
                if (data instanceof IdmEvent) {
                    this.allEvents.next(data);
                    if (data instanceof AdministrativeStateEvent) {
                        this.administrativeStateChanged.next(data);
                    } else if (data instanceof OperationalStateEvent) {
                        this.operationalStateChanged.next(data);
                    } else if (data instanceof UsageStateEvent) {
                        this.usageStateChanged.next(data);
                    } else if (data instanceof AbnormalComponentTerminationEvent) {
                        this.abnormalComponentTerminationChanged.next(data);
                    }
                }
            });
    }
}
