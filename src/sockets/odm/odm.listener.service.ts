import {
    Injectable,
    ReflectiveInjector,
    Optional
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { EventChannelService } from '../event.channel.service';

import { OdmEvent, deserializeOdmEvent } from './odm.event';

import {
    DomainManagementObjectAddedEvent,
    DomainManagementObjectRemovedEvent,
    SourceCategory
} from './domain.management.object.event';

export const ODM_CHANNEL_NAME: string = 'ODM_Channel';

/**
 * The OdmListenerService is similar to the ODMListener in the REDHAWK sandbox.
 * Use the `*Added$` and `*Removed$` observables to monitor those specific events.
 * Alternatively, monitor all events using `events$`.
 */
@Injectable()
export class OdmListenerService {

    public get allEvents$(): Observable<OdmEvent> {
        return this.allEvents.asObservable();
    }
    public get deviceManagerAdded$(): Observable<DomainManagementObjectAddedEvent> {
        return this.deviceManagerAdded.asObservable();
    }
    public get deviceManagerRemoved$(): Observable<DomainManagementObjectRemovedEvent> {
        return this.deviceManagerRemoved.asObservable();
    }
    public get deviceAdded$(): Observable<DomainManagementObjectAddedEvent> {
        return this.deviceAdded.asObservable();
    }
    public get deviceRemoved$(): Observable<DomainManagementObjectRemovedEvent> {
        return this.deviceRemoved.asObservable();
    }
    public get applicationFactoryAdded$(): Observable<DomainManagementObjectAddedEvent> {
        return this.applicationFactoryAdded.asObservable();
    }
    public get applicationFactoryRemoved$(): Observable<DomainManagementObjectRemovedEvent> {
        return this.applicationFactoryRemoved.asObservable();
    }
    public get applicationAdded$(): Observable<DomainManagementObjectAddedEvent> {
        return this.applicationAdded.asObservable();
    }
    public get applicationRemoved$(): Observable<DomainManagementObjectRemovedEvent> {
        return this.applicationRemoved.asObservable();
    }
    public get serviceAdded$(): Observable<DomainManagementObjectAddedEvent> {
        return this.serviceAdded.asObservable();
    }
    public get serviceRemoved$(): Observable<DomainManagementObjectRemovedEvent> {
        return this.serviceRemoved.asObservable();
    }

    // All events
    private allEvents: Subject<OdmEvent>;

    // Add/remove for individual elements.
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

    // The event interface
    private eventChannel: EventChannelService;


    public connect(domainId: string) {
        this.eventChannel.connect(domainId, ODM_CHANNEL_NAME);
    }

    public disconnect(domainId: string) {
        this.eventChannel.disconnect(domainId, ODM_CHANNEL_NAME);
    }

    constructor(@Optional() eventChannel: EventChannelService) {
        if (!eventChannel) {
            let injector = ReflectiveInjector.resolveAndCreate([EventChannelService]);
            eventChannel = injector.get(EventChannelService);
        }
        this.eventChannel = eventChannel;

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
                let odm = deserializeOdmEvent(data);
                this.allEvents.next(odm);
                if (odm instanceof DomainManagementObjectAddedEvent) {
                    this.handleAdd(odm);
                } else if (odm instanceof DomainManagementObjectRemovedEvent) {
                    this.handleRemove(odm);
                }
            });
    }

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
