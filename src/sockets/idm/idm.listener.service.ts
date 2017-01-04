import {
    Injectable,
    ReflectiveInjector,
    Optional
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { EventChannelService } from '../event.channel.service';

import {
    IdmEvent,
    deserializeIdmEvent,
    AdministrativeStateEvent,
    OperationalStateEvent,
    UsageStateEvent,
    AbnormalComponentTerminationEvent,
    // Type Guards
    isAdministrativeStateEvent,
    isOperationalStateEvent,
    isUsageStateEvent,
    isAbnormalComponentTerminationEvent
} from './idm.event';

/**
 * The IdmListenerService is similar to the IDMListener in the REDHAWK sandbox.
 * Use the `*Added$` and `*Removed$` observables to monitor those specific events.
 * Alternatively, monitor all events using `events$`.
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

    // The event interface
    private eventChannel: EventChannelService;


    public connect(domainId: string) {
        this.eventChannel.connect(domainId, 'IDM_Channel');
    }

    public disconnect(domainId: string) {
        this.eventChannel.disconnect(domainId, 'IDM_Channel');
    }

    constructor(@Optional() eventChannel: EventChannelService) {
        if (!eventChannel) {
            let injector = ReflectiveInjector.resolveAndCreate([EventChannelService]);
            eventChannel = injector.get(EventChannelService);
        }
        this.eventChannel = eventChannel;

        this.allEvents = new Subject<IdmEvent>();
        this.administrativeStateChanged = new Subject<AdministrativeStateEvent>();
        this.operationalStateChanged = new Subject<OperationalStateEvent>();
        this.usageStateChanged = new Subject<UsageStateEvent>();
        this.abnormalComponentTerminationChanged = new Subject<AbnormalComponentTerminationEvent>();

        this.eventChannel
            .events$
            .subscribe((data: any) => {
                let idm: IdmEvent = deserializeIdmEvent(data);
                this.allEvents.next(idm);
                if (isAdministrativeStateEvent(idm)) {
                    this.administrativeStateChanged.next(idm);
                } else if (isOperationalStateEvent(idm)) {
                    this.operationalStateChanged.next(idm);
                } else if (isUsageStateEvent(idm)) {
                    this.usageStateChanged.next(idm);
                } else if (isAbnormalComponentTerminationEvent(idm)) {
                    this.abnormalComponentTerminationChanged.next(idm);
                }
            });
    }
}
