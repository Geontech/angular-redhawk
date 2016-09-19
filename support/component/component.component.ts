import { Component, OnInit, Input } from '@angular/core';

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
    domainId: string;

    @Input()
    waveformId: string;

    @Input()
    componentId: string;

    public model: Component = new RPComponent();

    constructor(private _service: ComponentService) { }

    ngOnInit() {
        this.query();
    }

    private query(): void {
        this._service
            .getComponent(this.domainId, this.waveformId, this.componentId)
            .then(response => this.model = response);
    }
}
