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
} from '../../../models/index';

import { EventChannelService } from '../generic/index';

/**
 * Provides an instantiation of the IDM Listener Service
 * @param ecs An EventChannelService instance to utilize
 */
export function configureIdmListenerService(ecs: EventChannelService): IdmListenerService {
    const s = new IdmListenerService(ecs);
    return s;
}

/**
 * Returns providers for a pre-configured ODM Listener Service
 */
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

    /**
     * Observable for all possible events on the IDM Channel
     */
    public get allEvents$(): Observable<IdmEvent> {
        return this.allEvents.asObservable();
    }

    /**
     * Observable for specifically Administrative State Changed events.
     */
    public get administrativeStateChanged$(): Observable<AdministrativeStateEvent> {
        return this.administrativeStateChanged.asObservable();
    }

    /**
     * Observable for specifically Operational State Changed events.
     */
    public get operationalStateChanged$(): Observable<OperationalStateEvent> {
        return this.operationalStateChanged.asObservable();
    }

    /**
     * Observable for specifically Usage State Changed events.
     */
    public get usageStateChanged$(): Observable<UsageStateEvent> {
        return this.usageStateChanged.asObservable();
    }

    /**
     * Observable for specifically Abnormal Component Termination Changed events.
     */
    public get abnormalComponentTerminationChanged$(): Observable<AbnormalComponentTerminationEvent> {
        return this.abnormalComponentTerminationChanged.asObservable();
    }

    /** All events */
    private allEvents: Subject<IdmEvent>;

    /** Administrative state events */
    private administrativeStateChanged: Subject<AdministrativeStateEvent>;
    /** Operational state events */
    private operationalStateChanged: Subject<OperationalStateEvent>;
    /** Usage State events */
    private usageStateChanged: Subject<UsageStateEvent>;
    /** Abnormal termination events */
    private abnormalComponentTerminationChanged: Subject<AbnormalComponentTerminationEvent>;

    /**
     * Connect to a Domain's IDM Event Channel
     * @param domainId The Domain ID (Name)
     */
    public connect(domainId: string) {
        this.eventChannel.connect(domainId, 'IDM_Channel');
    }

    /**
     * Disconnect from a Domain's IDM Event Channel
     * @param domainId The Domain ID (Name)
     */
    public disconnect(domainId: string) {
        this.eventChannel.disconnect(domainId, 'IDM_Channel');
    }

    /**
     * Constructor
     * @param eventChannel The Event Channel (Service) to use for connections
     */
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
