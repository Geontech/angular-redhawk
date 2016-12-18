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

export function serviceSelect(
        service: DeviceManagerService,
        http: Http,
        domain: DomainService
    ): DeviceManagerService {
    if (service === null) {
        service = new DeviceManagerService(http, domain);
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
            DomainService
        ]
    } ]
})
export class ArDeviceManager implements OnDestroy, OnChanges {

    @Input('arDeviceManager') deviceManagerId: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally. 
     */
    @Input('arModel') model: DeviceManager;
    @Output('arModelChange') modelChange: EventEmitter<DeviceManager>;

    public get service(): DeviceManagerService { return this._service; }

    private subscription: Subscription = null;

    constructor(private _service: DeviceManagerService) {
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
