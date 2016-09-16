import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { RedhawkService }        from '../services/redhawk.service';
import { Redhawk, RedhawkEvent } from '../models/redhawk';

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

    ngOnInit() {
        // TODO: Connect to REDHAWK socket
        this.query();

        // Shutup tslint
        this.on_msg(new RedhawkEvent());
    }

    ngOnDestroy() {
        // TODO: Disconnect from REDHAWK socket
    }

    private on_msg(event: any): void {
        // TODO: Hook this to the socket as a callback

        // Notify any listeners
        this.domainsUpdated.emit(<RedhawkEvent>event);
    }

    private query(): void {
        // Get domain listing
        this._service
            .getDomainIds()
            .then(response => this.model = response);
    }
}
