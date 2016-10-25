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

import { WaveformService } from '../waveform/waveform.service';

import { ComponentService } from './component.service';
import { Component } from './component';

@Directive({
    selector: '[arComponent]',
    providers: [ ComponentService ]
})

export class ArComponentDirective implements OnInit, OnDestroy, OnChanges {

    @Input('arComponent') componentId: string;

    public model: Component = new Component();

    private subscription: Subscription = null;

    constructor(
        private service: ComponentService,
        @Host() private parentService: WaveformService
        ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('arComponent')) {
            this.service.uniqueId = this.componentId;
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
