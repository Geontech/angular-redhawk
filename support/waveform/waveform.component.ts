import { Component, OnInit, Input, Host} from '@angular/core';

import { DomainService }   from '../domain/domain.service';

import { WaveformService } from './waveform.service';
import { Waveform }        from './waveform';

@Component({
    selector: 'ar-waveform',
    template: `
        <ng-content></ng-content>
        `,
    providers: [ WaveformService ]
})

export class ArWaveform implements OnInit {

    @Input()
    waveformId: string;

    public model: Waveform = new Waveform();

    constructor(
        private service: WaveformService, 
        @Host() private parentService: DomainService
        ) { }

    ngOnInit() {
        this.service.uniqueId = this.waveformId;
        this.service.model.subscribe(it => this.model = it);
    }
}
