import { Injectable Provider } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import {
    OdmEvent,
    DomainManagementObjectAddedEvent,
    DomainManagementObjectRemovedEvent,
    SourceCategory
} from '../../../models/index';

import { EventChannelService } from '../generic/index';

/**
 * The ODM Event Channel name
 * @internal
 */
export const ODM_CHANNEL_NAME: string = 'ODM_Channel';

/**
 * Provides an instantiation of the ODM Listener Service
 * @param ecs An EventChannelService instance to utilize
 */
export function configureOdmListenerService(ecs: EventChannelService): OdmListenerService {
    const s = new OdmListenerService(ecs);
    return s;
}

/**
 * Returns providers for a pre-configured ODM Listener Service
 */
export function odmListenerServiceProvider(): Provider[] {
    return [
        EventChannelService,
        {
            provide: OdmListenerService,
            useFactory: configureOdmListenerService,
            deps: [ EventChannelService ]
        }
    ];
}

/**
 * The OdmListenerService is similar to the ODMListener in the REDHAWK sandbox.
 */
@Injectable()
export class OdmListenerService {

    /**
     * Obsevable for all possible events on the ODM Event Channel
     */
    public get allEvents$(): Observable<OdmEvent> {
        return this.allEvents.asObservable();
    }

    /**
     * Observable for specifically Device Manager Added events.
     */
    public get deviceManagerAdded$(): Observable<DomainManagementObjectAddedEvent> {
        return this.deviceManagerAdded.asObservable();
    }

    /**
     * Observable for specifically DeviceManager Removed events.
     */
    public get deviceManagerRemoved$(): Observable<DomainManagementObjectRemovedEvent> {
        return this.deviceManagerRemoved.asObservable();
    }

    /**
     * Observable for specifically Device Added events.
     */
     public get deviceAdded$(): Observable<DomainManagementObjectAddedEvent> {
        return this.deviceAdded.asObservable();
    }

    /**
     * Observable for specifically Device Removed events.
     */
    public get deviceRemoved$(): Observable<DomainManagementObjectRemovedEvent> {
        return this.deviceRemoved.asObservable();
    }

    /**
     * Observable for specifically Application Factory Added events.
     */
    public get applicationFactoryAdded$(): Observable<DomainManagementObjectAddedEvent> {
        return this.applicationFactoryAdded.asObservable();
    }

    /**
     * Observable for specifically Application Factory Removed events.
     */
    public get applicationFactoryRemoved$(): Observable<DomainManagementObjectRemovedEvent> {
        return this.applicationFactoryRemoved.asObservable();
    }

    /**
     * Observable for specifically Application Added events.
     */
    public get applicationAdded$(): Observable<DomainManagementObjectAddedEvent> {
        return this.applicationAdded.asObservable();
    }

    /**
     * Observable for specifically Application Removed events.
     */
    public get applicationRemoved$(): Observable<DomainManagementObjectRemovedEvent> {
        return this.applicationRemoved.asObservable();
    }

    /**
     * Observable for specifically Service Added events.
     */
    public get serviceAdded$(): Observable<DomainManagementObjectAddedEvent> {
        return this.serviceAdded.asObservable();
    }

    /**
     * Observable for specifically Service Removed events.
     */
    public get serviceRemoved$(): Observable<DomainManagementObjectRemovedEvent> {
        return this.serviceRemoved.asObservable();
    }

    // @internal All events
    private allEvents: Subject<OdmEvent>;

    // @internal Add/remove for individual elements.
    private deviceManagerAdded: Subject<DomainManagementObjectAddedEvent>;
    private deviceManagerRemoved: Subject<DomainManagementObjectRemovedEvent>;
    private deviceAdded: Subject<DomainManagementObjectAddedEvent>;
    private deviceRemoved: Subject<DomainManagementObjectRemovedEvent>;
    private applicationFactoryAdded: Subject<DomainManagementObjectAddedEvent>;
    private applicationFactoryRemoved: Subject<DomainManagementObjectRemovedEvent>;
    private applicationAdded: Subject<DomainManagementObjectAddedEvent>;
    private applicationRemoved: Subject<DomainManagementObjectRemovedEvent>;
    private serviceAdded: Subject<DomainManagementObjectAddedEvent>;
    private serviceRemoved: Subject<DomainManagementObjectRemovedEvent>;

    /**
     * Connect to a Domain's ODM Event Channel
     * @param domainId The Domain ID (Name)
     */
    public connect(domainId: string) {
        this.eventChannel.connect(domainId, ODM_CHANNEL_NAME);
    }

    /**
     * Disconnect from a Domain's ODM Event Channel
     * @param domainId The Domain ID (Name)
     */
    public disconnect(domainId: string) {
        this.eventChannel.disconnect(domainId, ODM_CHANNEL_NAME);
    }

    /**
     * @param eventChannel The Event Channel (Service) to use for connections
     */
    constructor(private eventChannel: EventChannelService) {

        this.allEvents = new Subject<OdmEvent>();
        this.deviceManagerAdded = new Subject<DomainManagementObjectAddedEvent>();
        this.deviceManagerRemoved = new Subject<DomainManagementObjectRemovedEvent>();
        this.deviceAdded = new Subject<DomainManagementObjectAddedEvent>();
        this.deviceRemoved = new Subject<DomainManagementObjectRemovedEvent>();
        this.applicationFactoryAdded = new Subject<DomainManagementObjectAddedEvent>();
        this.applicationFactoryRemoved = new Subject<DomainManagementObjectRemovedEvent>();
        this.applicationAdded = new Subject<DomainManagementObjectAddedEvent>();
        this.applicationRemoved = new Subject<DomainManagementObjectRemovedEvent>();
        this.serviceAdded = new Subject<DomainManagementObjectAddedEvent>();
        this.serviceRemoved = new Subject<DomainManagementObjectRemovedEvent>();

        this.eventChannel
            .events$
            .subscribe((data: any) => {
                if (data instanceof OdmEvent) {
                    this.allEvents.next(data);
                    if (data instanceof DomainManagementObjectAddedEvent) {
                        this.handleAdd(data);
                    } else if (data instanceof DomainManagementObjectRemovedEvent) {
                        this.handleRemove(data);
                    }
                }
            });
    }

    /**
     * @internal
     * Uses the event's source category to determine the subject to update.
     * @param event The Event to handle
     */
    private handleAdd(event: DomainManagementObjectAddedEvent) {
        switch (event.sourceCategory) {
            case SourceCategory.DEVICE_MANAGER:
                this.deviceManagerAdded.next(event);
                break;
            case SourceCategory.DEVICE:
                this.deviceAdded.next(event);
                break;
            case SourceCategory.APPLICATION_FACTORY:
                this.applicationFactoryAdded.next(event);
                break;
            case SourceCategory.APPLICATION:
                this.applicationAdded.next(event);
                break;
            case SourceCategory.SERVICE:
                this.serviceAdded.next(event);
                break;
            default:
                break;
        }
    }

    /**
     * @internal
     * Uses the event's source category to determine the subject to update.
     * @param event The Event to handle
     */
    private handleRemove(event: DomainManagementObjectRemovedEvent) {
        switch (event.sourceCategory) {
            case SourceCategory.DEVICE_MANAGER:
                this.deviceManagerRemoved.next(event);
                break;
            case SourceCategory.DEVICE:
                this.deviceRemoved.next(event);
                break;
            case SourceCategory.APPLICATION_FACTORY:
                this.applicationFactoryRemoved.next(event);
                break;
            case SourceCategory.APPLICATION:
                this.applicationRemoved.next(event);
                break;
            case SourceCategory.SERVICE:
                this.serviceRemoved.next(event);
                break;
            default:
                break;
        }
    }
}
