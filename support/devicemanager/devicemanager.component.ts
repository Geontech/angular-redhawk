import { Component, OnInit, Input, Host } from '@angular/core';

import { DomainService } from '../domain/domain.service';

import { DeviceManagerService } from './devicemanager.service';
import { DeviceManager }        from './devicemanager';

@Component({
    selector: 'ar-device-manager',
    template: `
        <ng-content></ng-content>
        `,
    providers: [ DeviceManagerService ]
})

export class ArDeviceManager implements OnInit {
    @Input()
    deviceManagerId: string;

    public model: DeviceManager = new DeviceManager();

    constructor(
        private service: DeviceManagerService, 
        @Host() private parentService: DomainService) { 
    }

    ngOnInit() {
        this.service.uniqueId = this.deviceManagerId;
        this.service.model.subscribe(it => this.model = it);
    }
}
