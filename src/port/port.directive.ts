import {
    Directive,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    Input,
    Output,
    EventEmitter,
    Optional,
    SkipSelf
} from '@angular/core';
import { Http } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';

// This service
import { PortService } from './port.service';

// This model
import { Port } from './port';

// Possible "parent" dependencies for the PortService
import { WaveformService } from '../waveform/waveform.service';
import { ComponentService } from '../component/component.service';
import { DeviceService } from '../device/device.service';

export function serviceSelect(
    service: PortService,
    http: Http,
    waveform: WaveformService,
    device: DeviceService,
    component: ComponentService): PortService {
    if (service === null) {
        service = new PortService(http, waveform, device, component);
    }
    return service;
}

@Directive({
    selector: '[arPort]',
    exportAs: 'arPort',
    providers: [{
        provide:    PortService,
        useFactory: serviceSelect,
        deps: [
            [PortService, new Optional(), new SkipSelf()],
            Http,
            [WaveformService, new Optional()],
            [DeviceService, new Optional()],
            [ComponentService, new Optional()]
        ]
    }]
})
export class ArPort implements OnDestroy, OnChanges {

    @Input('arPort') portId: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally. 
     */
    @Input('arModel') model: Port;
    @Output('arModelChange') modelChange: EventEmitter<Port>;

    public get service(): PortService { return this._service; }

    private subscription: Subscription = null;

    constructor(private _service: PortService) {
            this.modelChange = new EventEmitter<Port>();
            this.model = new Port();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('portId')) {
            this.service.uniqueId = this.portId;
            if (!this.subscription) {
                this.subscription = this.service.model$.subscribe(it => {
                    this.model = it;
                    this.modelChange.emit(this.model);
                });
            }
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
