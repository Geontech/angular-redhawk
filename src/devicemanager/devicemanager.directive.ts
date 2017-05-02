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

import { DomainService } from '../domain/domain.service';
import { DeviceManagerService } from './devicemanager.service';
import { DeviceManager }        from './devicemanager';

import { RestPythonService } from '../shared/rest.python.service';

export function serviceSelect(
        service: DeviceManagerService,
        http: Http,
        restPython: RestPythonService,
        domain: DomainService
    ): DeviceManagerService {
    if (service === null) {
        service = new DeviceManagerService(http, restPython, domain);
    }
    return service;
}

@Directive({
    selector: '[arDeviceManager]',
    exportAs: 'arDeviceManager',
    providers: [ {
        provide: DeviceManagerService,
        useFactory: serviceSelect,
        deps: [
            [DeviceManagerService, new Optional(), new SkipSelf()],
            Http,
            RestPythonService,
            DomainService
        ]
    } ]
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
            this.service.setUniqueId(this.deviceManagerId);
            if (!this.subscription) {
                this.subscription = this.service.model$().subscribe(it => {
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
