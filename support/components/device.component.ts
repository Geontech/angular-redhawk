import { Component, OnInit, Input } from '@angular/core';

import { DeviceService } from '../services/device.service';
import { Device }        from '../models/device';

@Component({
    selector: 'ar-device',
    template: `
        <ng-content></ng-content>
        `,
    providers: [ DeviceService ]
})

export class ArDevice implements OnInit {
    @Input()
    domainId: string;

    @Input()
    deviceManagerId: string;

    @Input()
    deviceId: string;

    public model: Device = new Device();

    constructor(private _service: DeviceService) { }

    ngOnInit() {
        this.query();
    }

    private query(): void {
        this._service
            .getDevice(this.domainId, this.deviceManagerId, this.deviceId)
            .then(response => this.model = response);
    }
}
