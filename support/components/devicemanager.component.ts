import { Component, OnInit, Input } from '@angular/core';

import { DeviceManagerService } from '../services/devicemanager.service';
import { DeviceManager }        from '../models/devicemanager';

@Component({
    selector: 'ar-device-manager',
    template: `
        <ng-content></ng-content>
        `,
    providers: [ DeviceManagerService ]
})

export class ArDeviceManager implements OnInit {
    @Input()
    domainId: string;

    @Input()
    deviceManagerId: string;

    public model: DeviceManager = new DeviceManager();

    constructor(private _service: DeviceManagerService) { }

    ngOnInit() {
        this.query();
    }

    private query(): void {
        this._service
            .getDeviceManager(this.domainId, this.deviceManagerId)
            .then(response => this.model = response);
    }
}
