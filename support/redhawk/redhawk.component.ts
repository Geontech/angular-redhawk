import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { RedhawkService }        from './redhawk.service';
import { Redhawk, RedhawkEvent } from './redhawk';

@Component({
    selector: 'ar-redhawk',
    template: `
        <ng-content></ng-content>
        `,
    providers: [ RedhawkService ]
})

export class ArRedhawk implements OnInit, OnDestroy {
    @Output()
    domainsUpdated = new EventEmitter<RedhawkEvent>();

    public model: Redhawk = new Redhawk();

    constructor(private service: RedhawkService) { }

    ngOnInit() {
        this.service.uniqueId = "Angular-REDHAWK";
        this.service.model.subscribe(it => this.model = it);
    }

    ngOnDestroy() {
        // TODO: Disconnect from REDHAWK socket
    }
}
