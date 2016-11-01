import {
    Directive,
    OnInit,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    Input,
    Host
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { DeviceManagerService } from '../devicemanager/devicemanager.service';

import { DeviceService } from './device.service';
import { Device }        from './device';

@Directive({
    selector: '[arDevice]',
    exportAs: 'arDevice',
    providers: [ DeviceService ]
})

export class ArDeviceDirective implements OnInit, OnDestroy, OnChanges {

    @Input('arDevice') deviceId: string;

    public model: Device = new Device();

    private subscription: Subscription = null;

    constructor(
        private service: DeviceService,
        @Host() private parentService: DeviceManagerService
        ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('arDevice')) {
            this.service.uniqueId = this.deviceId;
            if (!this.subscription) {
                this.subscription = this.service.model$.subscribe(it => this.model = it);
            }
        }
    }

    ngOnInit() { /** */ }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
