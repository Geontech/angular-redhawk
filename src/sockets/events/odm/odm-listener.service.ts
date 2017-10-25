import {
    Injectable,
    ReflectiveInjector,
    Optional
} from '@angular/core';
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

export const ODM_CHANNEL_NAME: string = 'ODM_Channel';

export function configureOdmListenerService(ecs: EventChannelService): OdmListenerService {
    const s = new OdmListenerService(ecs);
    return s;
}

export function odmListenerServiceProvider(): any {
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

    public connect(domainId: string) {
        this.eventChannel.connect(domainId, ODM_CHANNEL_NAME);
    }

    public disconnect(domainId: string) {
        this.eventChannel.disconnect(domainId, ODM_CHANNEL_NAME);
    }

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
