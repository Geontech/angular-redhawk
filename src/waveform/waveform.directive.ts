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

import { DomainService }   from '../domain/domain.service';

import { WaveformService } from './waveform.service';
import { Waveform }        from './waveform';

@Directive({
    selector: '[arWaveform]',
    providers: [ WaveformService ]
})
export class ArWaveform implements OnInit, OnDestroy, OnChanges {

    @Input('arWaveform') waveformId: string;

    public model: Waveform = new Waveform();

    private subscription: Subscription = null;

    constructor(
        private service: WaveformService,
        @Host() private parentService: DomainService
        ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('arWaveform')) {
            this.service.uniqueId = this.waveformId;
            if (!this.subscription) {
                this.subscription = this.service.model.subscribe(it => this.model = it);
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
