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

import { DomainService } from '../domain/domain.service';

import { DeviceManagerService } from './devicemanager.service';
import { DeviceManager }        from './devicemanager';

@Directive({
    selector: '[arDeviceManager]',
    providers: [ DeviceManagerService ]
})
export class ArDeviceManager implements OnInit, OnDestroy, OnChanges {
    @Input('arDeviceManager') deviceManagerId: string;

    public model: DeviceManager = new DeviceManager();

    private subscription: Subscription = null;

    constructor(
        private service: DeviceManagerService,
        @Host() private parentService: DomainService) {
    }


    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('arDeviceManager')) {
            this.service.uniqueId = this.deviceManagerId;
            if (!this.subscription) {
                this.subscription = this.service.model.subscribe(it => this.model = it);
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
