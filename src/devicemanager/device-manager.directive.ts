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

    /**
     * "Banana Syntax" [()] for accessing the model externally.
     */
    @Input('arModel') model: DeviceManager;
    @Output('arModelChange') modelChange: EventEmitter<DeviceManager>;

    /** Internal subscription for the model */
    private subscription: Subscription = null;

    /**
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

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('deviceManagerId') && this.deviceManagerId) {
            this.service.uniqueId = this.deviceManagerId;
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
