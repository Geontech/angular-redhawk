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

import { Waveform }          from '../models/index';
import { DomainService }     from '../domain/domain.module';
import { RestPythonService } from '../rest-python/rest-python.module';

import { WaveformService } from './waveform.service';

export function serviceSelect (
    service: WaveformService,
    http: Http,
    restPython: RestPythonService,
    domain: DomainService): WaveformService {
    if (service === null) {
        service = new WaveformService(http, restPython, domain);
    }
    return service;
}

/**
 * The Waveform directive provides the dependency injection start point for
 * a running Waveform (Application) in the Domain
 */
@Directive({
    selector: '[arWaveform]',
    exportAs: 'arWaveform',
    providers: [{
        provide:    WaveformService,
        useFactory: serviceSelect,
        deps: [
            [WaveformService, new Optional(), new SkipSelf()],
            Http,
            RestPythonService,
            DomainService
        ]
    }]
})
export class WaveformDirective implements OnDestroy, OnChanges {

    @Input('arWaveform') waveformId: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally.
     */
    @Input('arModel') model: Waveform;
    @Output('arModelChange') modelChange: EventEmitter<Waveform>;

    private subscription: Subscription = null;

    constructor(public service: WaveformService) {
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
