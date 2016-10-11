import { Component, OnInit, OnDestroy, Input, Host, Optional } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

// Parent Services
import { WaveformService } from '../waveform/waveform.service';
import { DeviceService } from '../device/device.service';
import { ComponentService } from '../component/component.service';

// This service
import { PortService } from './port.service';

// This model
import { Port } from './port';

@Component({
    // moduleId: module.id,
    selector: 'ar-port',
    template: `
        <ng-content></ng-content>
        `,
    providers: [ PortService ]
})

export class ArPort implements OnInit, OnDestroy {

    @Input()
    portId: string;

    public model: Port = new Port();

    private subscription: Subscription;

    private parentService: WaveformService | DeviceService | ComponentService;

    constructor(
        private service: PortService,
        @Host() @Optional() private _wave?: WaveformService,
        @Host() @Optional() private _device?: DeviceService,
        @Host() @Optional() private _component?: ComponentService
        ) {
        if (_wave) {
            this.parentService = _wave;
        } else if (_device) {
            this.parentService = _device;
        } else if (_component) {
            this.parentService = _component;
        } else {
            console.error('Failed to provide a port bearing service');
        }
    }

    ngOnInit() {
        this.service.uniqueId = this.portId;
        this.subscription = this.service.model.subscribe(it => this.model = it);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
