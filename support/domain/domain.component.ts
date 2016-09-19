import { Component, OnInit, Input } from '@angular/core';

import { DomainService } from './domain.service';
import { Domain }        from './domain';

@Component({
    selector: 'ar-domain',
    template: `
        <ng-content></ng-content>
        `,
    providers: [ DomainService ]
})

export class ArDomain implements OnInit {
    @Input()
    model: Domain;

    constructor(private _service: DomainService) { }

    ngOnInit() {
        // TODO: Something...
    }
}
