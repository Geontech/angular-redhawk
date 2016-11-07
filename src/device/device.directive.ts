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

import { DeviceService } from './device.service';
import { Device }        from './device';

@Directive({
    selector: '[arDevice]',
    exportAs: 'arDevice',
    providers: [ { provide: 'DefaultDeviceService', useClass: DeviceService } ]
})

export class ArDevice implements OnDestroy, OnChanges {

    @Input('arDevice') deviceId: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally. 
     */
    @Input('arModel') model: Device;
    @Output('arModelChange') modelChange: EventEmitter<Device>;

    public get service(): DeviceService { return this._service; }

    private subscription: Subscription = null;
    private _service: DeviceService;

    constructor(
        @Inject('DefaultDeviceService') local: DeviceService,
        @Optional() host: DeviceService) {
            this._service = host ? host : local;
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
