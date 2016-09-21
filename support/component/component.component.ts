import { Component, OnInit, Input, Host } from '@angular/core';

import { WaveformService } from '../waveform/waveform.service';

import { ComponentService }         from './component.service';
import { Component as RPComponent } from './component';

@Component({
    selector: 'ar-component',
    template: `
        <ng-content></ng-content>
        `,
    providers: [ ComponentService ]
})

export class ArComponent implements OnInit {

    @Input()
    componentId: string;

    public model: RPComponent = new RPComponent();

    constructor(
        private service: ComponentService,
        @Host() private parentService: WaveformService
        ) { }

    ngOnInit() {
        this.service.uniqueId = this.componentId;
        this.service.model.subscribe(it => this.model = it);
    }
}
