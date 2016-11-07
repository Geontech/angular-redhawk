import {
    Injectable,
    ReflectiveInjector,
    Optional
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { EventChannelService } from '../event.channel.service';

import { OdmEvent, SourceCategory } from './odm.event';

// Export the structure and enumeration.
export { OdmEvent, SourceCategory } from './odm.event';

/**
 * The OdmListenerService is similar to the ODMListener in the REDHAWK sandbox.
 * Use the `*Added$` and `*Removed$` observables to monitor those specific events.
 * Alternatively, monitor all events using `events$`.
 */
@Injectable()
export class OdmListenerService {

    public get allEvents$(): Observable<OdmEvent> { return this.allEvents.asObservable(); }

    public get deviceManagerAdded$(): Observable<OdmEvent> { return this.deviceManagerAdded.asObservable(); }
    public get deviceManagerRemoved$(): Observable<OdmEvent> { return this.deviceManagerRemoved.asObservable(); }
    public get deviceAdded$(): Observable<OdmEvent> { return this.deviceAdded.asObservable(); }
    public get deviceRemoved$(): Observable<OdmEvent> { return this.deviceRemoved.asObservable(); }
    public get applicationFactoryAdded$(): Observable<OdmEvent> { return this.applicationFactoryAdded.asObservable(); }
    public get applicationFactoryRemoved$(): Observable<OdmEvent> { return this.applicationFactoryRemoved.asObservable(); }
    public get applicationAdded$(): Observable<OdmEvent> { return this.applicationAdded.asObservable(); }
    public get applicationRemoved$(): Observable<OdmEvent> { return this.applicationRemoved.asObservable(); }
    public get serviceAdded$(): Observable<OdmEvent> { return this.serviceAdded.asObservable(); }
    public get serviceRemoved$(): Observable<OdmEvent> { return this.serviceRemoved.asObservable(); }

    // All events
    private allEvents: Subject<OdmEvent>;

    // Add/remove for individual elements.
    private deviceManagerAdded: Subject<OdmEvent>;
    private deviceManagerRemoved: Subject<OdmEvent>;
    private deviceAdded: Subject<OdmEvent>;
    private deviceRemoved: Subject<OdmEvent>;
    private applicationFactoryAdded: Subject<OdmEvent>;
    private applicationFactoryRemoved: Subject<OdmEvent>;
    private applicationAdded: Subject<OdmEvent>;
    private applicationRemoved: Subject<OdmEvent>;
    private serviceAdded: Subject<OdmEvent>;
    private serviceRemoved: Subject<OdmEvent>;

    // The event interface
    private eventChannel: EventChannelService;


    public connect(domainId: string) {
        this.eventChannel.connect(domainId, 'ODM_Channel');
    }

    public disconnect(domainId: string) {
        this.eventChannel.disconnect(domainId, 'ODM_Channel');
    }

    constructor(@Optional() eventChannel: EventChannelService) {
        if (!eventChannel) {
            let injector = ReflectiveInjector.resolveAndCreate([EventChannelService]);
            eventChannel = injector.get(EventChannelService);
        }
        this.eventChannel = eventChannel;

        this.allEvents = new Subject<OdmEvent>();
        this.deviceManagerAdded = new Subject<OdmEvent>();
        this.deviceManagerRemoved = new Subject<OdmEvent>();
        this.deviceAdded = new Subject<OdmEvent>();
        this.deviceRemoved = new Subject<OdmEvent>();
        this.applicationFactoryAdded = new Subject<OdmEvent>();
        this.applicationFactoryRemoved = new Subject<OdmEvent>();
        this.applicationAdded = new Subject<OdmEvent>();
        this.applicationRemoved = new Subject<OdmEvent>();
        this.serviceAdded = new Subject<OdmEvent>();
        this.serviceRemoved = new Subject<OdmEvent>();

        this.eventChannel
            .events$
            .subscribe((data: any) => {
                let odm = new OdmEvent().deserialize(data);
                this.allEvents.next(odm);
                if (odm.sourceIOR) {
                    this.handleAdd(odm);
                } else {
                    this.handleRemove(odm);
                }
            });
    }

    private handleAdd(event: OdmEvent) {
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

    private handleRemove(event: OdmEvent) {
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
