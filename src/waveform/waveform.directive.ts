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

import { DomainService } from '../domain/domain.service';
import { WaveformService } from './waveform.service';
import { Waveform }        from './waveform';


export function serviceSelect (
    service: WaveformService,
    http: Http,
    domain: DomainService): WaveformService {
    if (service === null) {
        service = new WaveformService(http, domain);
    }
    return service;
}

@Directive({
    selector: '[arWaveform]',
    exportAs: 'arWaveform',
    providers: [{
        provide:    WaveformService,
        useFactory: serviceSelect,
        deps: [
            [WaveformService, new Optional(), new SkipSelf()],
            Http,
            DomainService
        ]
    }]
})
export class ArWaveform implements OnDestroy, OnChanges {

    @Input('arWaveform') waveformId: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally. 
     */
    @Input('arModel') model: Waveform;
    @Output('arModelChange') modelChange: EventEmitter<Waveform>;

    public get service(): WaveformService { return this._service; }

    private subscription: Subscription = null;

    constructor(private _service: WaveformService) {
        this.modelChange = new EventEmitter<Waveform>();
        this.model = new Waveform();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('waveformId')) {
            this.service.uniqueId = this.waveformId;
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
