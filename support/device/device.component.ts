import { Component, OnInit, Input, Host } from '@angular/core';

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

export class ArDevice implements OnInit {

    @Input()
    deviceId: string;

    public model: Device = new Device();

    constructor(
        private service: DeviceService,
        @Host() private parentService: DeviceManagerService
        ) { }

    ngOnInit() {
        this.service.uniqueId = this.deviceId;
        this.service.model.subscribe(it => this.model = it);
    }
}
