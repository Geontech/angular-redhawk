import { Component, OnInit, OnDestroy, Input, Host } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { DeviceManagerService } from '../devicemanager/devicemanager.service';

import { DeviceService } from './device.service';
import { Device }        from './device';

@Component({
    selector: 'ar-device',
    template: `
        <ng-content></ng-content>
        `,
    providers: [ DeviceService ]
})

export class ArDevice implements OnInit, OnDestroy {

    @Input()
    deviceId: string;

    public model: Device = new Device();

    private subscription: Subscription;

    constructor(
        private service: DeviceService,
        @Host() private parentService: DeviceManagerService
        ) { }

    ngOnInit() {
        this.service.uniqueId = this.deviceId;
        this.subscription = this.service.model.subscribe(it => this.model = it);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
