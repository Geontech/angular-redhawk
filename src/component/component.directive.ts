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

import { WaveformService } from '../waveform/waveform.service';
import { ComponentService } from './component.service';
import { Component } from './component';

export function serviceSelect(
    service: ComponentService,
    http: Http,
    waveform: WaveformService): ComponentService {
    if (service === null) {
        service = new ComponentService(http, waveform);
    }
    return service;
}

@Directive({
    selector: '[arComponent]',
    exportAs: 'arComponent',
    providers: [{
        provide:    ComponentService,
        useFactory: serviceSelect,
        deps: [
        [ComponentService, new Optional(), new SkipSelf()],
        Http,
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
            this.service.setUniqueId(this.componentId);
            if (!this.subscription) {
                this.subscription = this.service.model$().subscribe(it => {
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
