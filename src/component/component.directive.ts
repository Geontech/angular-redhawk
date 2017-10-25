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

import { Component } from '../models/index';
import { RestPythonService } from '../rest-python/rest-python.module';
import { WaveformService } from '../waveform/waveform.module';

// This service
import { ComponentService } from './component.service';

export function serviceSelect(
    service: ComponentService,
    http: Http,
    restPython: RestPythonService,
    waveform: WaveformService): ComponentService {
    if (service === null) {
        service = new ComponentService(http, restPython, waveform);
    }
    return service;
}

/**
 * The Component Directive provides access to a specific Component model including
 * the configuration of its properties and access to its ports.
 */
@Directive({
    selector: '[arComponent]',
    exportAs: 'arComponent',
    providers: [{
        provide:    ComponentService,
        useFactory: serviceSelect,
        deps: [
            [ComponentService, new Optional(), new SkipSelf()],
            Http,
            RestPythonService,
            WaveformService
        ]
    }]
})
export class ComponentDirective implements OnDestroy, OnChanges {

    @Input('arComponent') componentId: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally.
     */
    @Input('arModel') model: Component;
    @Output('arModelChange') modelChange: EventEmitter<Component>;

    private subscription: Subscription = null;

    constructor(public service: ComponentService) {
        this.modelChange = new EventEmitter<Component>();
        this.model = new Component();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('componentId')) {
            this.service.uniqueId = this.componentId;
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
