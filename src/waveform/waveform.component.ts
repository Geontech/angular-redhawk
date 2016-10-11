import { Component, OnInit, OnDestroy, Input, Host} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { DomainService }   from '../domain/domain.service';

import { WaveformService } from './waveform.service';
import { Waveform }        from './waveform';

@Component({
    // moduleId: module.id,
    selector: 'ar-waveform',
    template: `
        <ng-content></ng-content>
        `,
    providers: [ WaveformService ]
})

export class ArWaveform implements OnInit, OnDestroy {

    @Input()
    waveformId: string;

    public model: Waveform = new Waveform();

    private subscription: Subscription;

    constructor(
        private service: WaveformService,
        @Host() private parentService: DomainService
        ) { }

    ngOnInit() {
        this.service.uniqueId = this.waveformId;
        this.subscription = this.service.model.subscribe(it => this.model = it);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
