import {
    Directive,
    OnInit,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    Input,
    Host,
    Optional
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

// Parent Services
import { WaveformService } from '../waveform/waveform.service';
import { DeviceService } from '../device/device.service';
import { ComponentService } from '../component/component.service';

// This service
import { PortService } from './port.service';

// This model
import { Port } from './port';

@Directive({
    selector: '[arPort]',
    providers: [ PortService ]
})
export class ArPortDirective implements OnInit, OnDestroy, OnChanges {

    @Input('arPort') portId: string;

    public model: Port = new Port();

    private subscription: Subscription = null;

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

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('arPort')) {
            this.service.uniqueId = this.portId;
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
