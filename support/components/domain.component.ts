import { Component, OnInit, Input } from '@angular/core';

import { DomainService }    from '../services/domain.service';
import { Domain } from '../models/domain';

@Component({
    selector: 'ar-domain',
    template: `
        <ng-content></ng-content>
        `,
    providers: [ DomainService ]
})

export class ArDomain implements OnInit {
    @Input()
    domainId: string;

    public model: Domain = new Domain();

    constructor(private _service: DomainService) { }

    ngOnInit() {
        this.query();
    }

    private query(): void {
        this._service
            .getDomain(this.domainId)
            .then(response => this.model = response)
            .then(response => console.log(this.model));
    }
}
