import { Component, OnInit, OnDestroy, Input, Host } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { DomainService } from '../domain/domain.service';

import { DeviceManagerService } from './devicemanager.service';
import { DeviceManager }        from './devicemanager';

@Component({
    moduleId: module.id,
    selector: 'ar-device-manager',
    template: `
        <ng-content></ng-content>
        `,
    providers: [ DeviceManagerService ]
})

export class ArDeviceManager implements OnInit, OnDestroy {
    @Input()
    deviceManagerId: string;

    public model: DeviceManager = new DeviceManager();

    private subscription: Subscription;

    constructor(
        private service: DeviceManagerService, 
        @Host() private parentService: DomainService) { 
    }

    ngOnInit() {
        this.service.uniqueId = this.deviceManagerId;
        this.subscription = this.service.model.subscribe(it => this.model = it);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
