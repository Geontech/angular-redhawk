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

import { DeviceManager }     from '../models/index';

import { DeviceManagerService } from './device-manager.service';
import { deviceManagerServiceProvider } from './device-manager-service-provider';

/**
 * The DeviceManager Directive provides access to a specific DeviceManager model
 * 
 * @example
 * <div [arDeviceManager]="'DCE:...'" [(arModel)]="my_model">
 */
@Directive({
    selector: '[arDeviceManager]',
    exportAs: 'arDeviceManager',
    providers: [ deviceManagerServiceProvider() ]
})
export class DeviceManagerDirective implements OnDestroy, OnChanges {

    /**
     * Sets the ID for the underlying service
     */
    @Input('arDeviceManager') deviceManagerId: string;

    /** Setter for "Banana in a Box Syntax"  */
    @Input('arModel') model: DeviceManager;
    /** Emitter for "Banana in a Box Syntax"  */
    @Output('arModelChange') modelChange: EventEmitter<DeviceManager>;

    /** Internal subscription for the model */
    private subscription: Subscription = null;

    /**
     * Constructor
     * @param service The service either imported from up the hierarchy or instantiated
     *                by this directive.
     */
    constructor(public service: DeviceManagerService) {
        this.modelChange = new EventEmitter<DeviceManager>();
        this.subscription = this.service.model$.subscribe(it => {
            this.model = it;
            this.modelChange.emit(this.model);
        });
    }

    /**
     * Implementation of the OnChanges interface updates the service's uniqueID
     * @param changes The changes made to this component
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('deviceManagerId') && this.deviceManagerId) {
            this.service.uniqueId = this.deviceManagerId;
        }
    }

    /**
     * Implementation of the OnDestroy interface unsubscribes from the model observable.
     */
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
