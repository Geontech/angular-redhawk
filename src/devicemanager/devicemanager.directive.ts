import {
    Directive,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    Input,
    Output,
    EventEmitter,
    Optional,
    Inject
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { DeviceManagerService } from './devicemanager.service';
import { DeviceManager }        from './devicemanager';

@Directive({
    selector: '[arDeviceManager]',
    exportAs: 'arDeviceManager',
    providers: [ { provide: 'DefaultDeviceManagerService', useClass: DeviceManagerService } ]
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
    private _service: DeviceManagerService;

    constructor(
        @Inject('DefaultDeviceManagerSErvice') local: DeviceManagerService,
        @Optional() host: DeviceManagerService) {
            this._service = host ? host : local;
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
