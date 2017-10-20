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

import { DeviceManagerService } from '../devicemanager/devicemanager.service';
import { DeviceService } from './device.service';
import { Device }        from './device';

import { RestPythonService } from '../shared/rest.python.service';

export function serviceSelect (
    service: DeviceService,
    http: Http,
    restPython: RestPythonService,
    dm: DeviceManagerService
    ): DeviceService {
    if (service === null) {
        service = new DeviceService(http, restPython, dm);
    }
    return service;
}

@Directive({
    selector: '[arDevice]',
    exportAs: 'arDevice',
    providers: [{
        provide:    DeviceService,
        useFactory: serviceSelect,
        deps: [
            [DeviceService, new Optional(), new SkipSelf()],
            Http,
            RestPythonService,
            DeviceManagerService
        ]
    }]
})

export class DeviceDirective implements OnDestroy, OnChanges {

    @Input('arDevice') deviceId: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally.
     */
    @Input('arModel') model: Device;
    @Output('arModelChange') modelChange: EventEmitter<Device>;

    private subscription: Subscription = null;

    constructor(public service: DeviceService) {
        this.modelChange = new EventEmitter<Device>();
        this.model = new Device();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('deviceId')) {
            this.service.uniqueId = this.deviceId;
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
