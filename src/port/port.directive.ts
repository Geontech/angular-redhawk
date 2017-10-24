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

// This model, rest service, possible parent services
import { Port }              from '../models/index';
import { RestPythonService } from '../rest-python/rest-python.module';
import { WaveformService }   from '../waveform/waveform.module';
import { ComponentService }  from '../component/component.module';
import { DeviceService }     from '../device/device.module';

// This service
import { PortService } from './port.service';


export function serviceSelect(
    service: PortService,
    http: Http,
    restPython: RestPythonService,
    waveform: WaveformService,
    device: DeviceService,
    component: ComponentService): PortService {
    if (service === null) {
        service = new PortService(http, restPython, waveform, device, component);
    }
    return service;
}

/**
 * The Port directive provides access to the variety of port types in REDHAWK.
 * Port-specific features can be accessed through the 'service'.
 */
@Directive({
    selector: '[arPort]',
    exportAs: 'arPort',
    providers: [{
        provide:    PortService,
        useFactory: serviceSelect,
        deps: [
            [PortService, new Optional(), new SkipSelf()],
            Http,
            RestPythonService,
            [WaveformService, new Optional()],
            [DeviceService, new Optional()],
            [ComponentService, new Optional()]
        ]
    }]
})
export class PortDirective implements OnDestroy, OnChanges {

    @Input('arPort') portId: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally.
     */
    @Input('arModel') model: Port;
    @Output('arModelChange') modelChange: EventEmitter<Port>;

    private subscription: Subscription = null;

    constructor(public service: PortService) {
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
