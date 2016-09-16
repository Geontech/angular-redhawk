import { Component, OnInit, Input } from '@angular/core';

import { WaveformService } from '../services/waveform.service';
import { Waveform }        from '../models/waveform';

@Component({
    selector: 'ar-waveform',
    template: `
        <ng-content></ng-content>
        `,
    providers: [ WaveformService ]
})

export class ArWaveform implements OnInit {
    @Input()
    domainId: string;

    @Input()
    waveformId: string;

    public model: Waveform = new Waveform();

    constructor(private _service: WaveformService) { }

    ngOnInit() {
        this.query();
    }

    private query(): void {
        this._service
            .getWaveform(this.domainId, this.waveformId)
            .then(response => this.model = response);
    }
}
