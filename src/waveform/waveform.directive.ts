import {
    Directive,
    OnInit,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    Input
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { DomainService }   from '../domain/domain.service';

import { WaveformService } from './waveform.service';
import { Waveform }        from './waveform';

@Directive({
    selector: '[arWaveform]',
    exportAs: 'arWaveform',
    providers: [ WaveformService ]
})
export class ArWaveformDirective implements OnInit, OnDestroy, OnChanges {

    @Input('arWaveform') waveformId: string;

    public model: Waveform = new Waveform();

    private subscription: Subscription = null;

    constructor(
        private service: WaveformService,
        private parentService: DomainService
        ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('waveformId')) {
            this.service.uniqueId = this.waveformId;
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
