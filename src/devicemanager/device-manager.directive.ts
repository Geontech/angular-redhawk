import {
    Directive,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    Input,
    Output,
    EventEmitter,
    Optional,
    SkipSelf
} from '@angular/core';
import { Http } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';

import { DeviceManager }     from '../models/index';
import { RestPythonService } from '../rest-python/rest-python.module';
import { DomainService }        from '../domain/domain.module';

import { DeviceManagerService } from './device-manager.service';
import { deviceManagerServiceProvider } from './device-manager-service-provider';

@Directive({
    selector: '[arDeviceManager]',
    exportAs: 'arDeviceManager',
    providers: [ deviceManagerServiceProvider() ]
})
export class DeviceManagerDirective implements OnDestroy, OnChanges {

    @Input('arDeviceManager') deviceManagerId: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally.
     */
    @Input('arModel') model: DeviceManager;
    @Output('arModelChange') modelChange: EventEmitter<DeviceManager>;

    private subscription: Subscription = null;

    constructor(public service: DeviceManagerService) {
            this.modelChange = new EventEmitter<DeviceManager>();
            this.model = new DeviceManager();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('deviceManagerId')) {
            this.service.uniqueId = this.deviceManagerId;
            if (!this.subscription) {
                this.subscription = this.service.model$.subscribe(it => {
                    this.model = it;
                    this.modelChange.emit(this.model);
                });
            }
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
