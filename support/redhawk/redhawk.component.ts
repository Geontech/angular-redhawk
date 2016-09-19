import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { RedhawkService }        from './redhawk.service';
import { Redhawk, RedhawkEvent } from './redhawk';

// Other models
import { Domain }                from '../domain/domain';

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

    constructor(private _service: RedhawkService) { }

    public getDomain(domainId: string): Domain {
        let inst = new Domain();
        this._service.getDomain(domainId)
            .then(res => inst = res);
        return inst;
    }

    ngOnInit() {
        // TODO: Connect to REDHAWK socket
        this.query();
    }

    ngOnDestroy() {
        // TODO: Disconnect from REDHAWK socket
    }

    private query(): void {
        // Get domain listing
        this._service
            .getRedhawk()
            .then(response => this.model = response);
    }
}
