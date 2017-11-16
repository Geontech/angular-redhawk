import {
    Directive,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

// Model
import { Device } from '../models/index';

// This service
import { DeviceService }         from './device.service';
import { deviceServiceProvider } from './device-service-provider';

/**
 * The Device Directive provides access to a specific Device model including
 * the configuration, allocation, and deallocation of its properties and access
 * to its ports.
 * 
 * @example
 * <div [arDevice]="'DCE:...'" [(arModel)]="my_model">
 */
@Directive({
    selector: '[arDevice]',
    exportAs: 'arDevice',
    providers: [ deviceServiceProvider() ]
})
export class DeviceDirective implements OnDestroy, OnChanges {

    /**
     * Sets the ID for the underlying service
     */
    @Input('arDevice') deviceId: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally.
     */
    @Input('arModel') model: Device;
    @Output('arModelChange') modelChange: EventEmitter<Device>;

    /** Internal subscription for the model */
    private subscription: Subscription = null;

    /**
     * @param service The service either imported from up the hierarchy or instantiated
     *                by this directive.
     */
    constructor(public service: DeviceService) {
        this.modelChange = new EventEmitter<Device>();
        this.subscription = this.service.model$.subscribe(it => {
            this.model = it;
            this.modelChange.emit(this.model);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('deviceId') && this.deviceId) {
            this.service.uniqueId = this.deviceId;
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
