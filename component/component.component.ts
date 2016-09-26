import { Component, OnInit, OnDestroy, Input, Host } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { WaveformService } from '../waveform/waveform.service';

import { ComponentService }         from './component.service';
import { Component as RPComponent } from './component';

@Component({
    moduleId: module.id,
    selector: 'ar-component',
    template: `
        <ng-content></ng-content>
        `,
    providers: [ ComponentService ]
})

export class ArComponent implements OnInit, OnDestroy {

    @Input()
    componentId: string;

    public model: RPComponent = new RPComponent();

    private subscription: Subscription;

    constructor(
        private service: ComponentService,
        @Host() private parentService: WaveformService
        ) { }

    ngOnInit() {
        this.service.uniqueId = this.componentId;
        this.subscription = this.service.model.subscribe(it => this.model = it);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
