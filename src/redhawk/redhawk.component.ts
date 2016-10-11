import {
    Component,
    OnInit,
    OnDestroy,
    Output,
    EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { RedhawkService }        from './redhawk.service';
import { Redhawk, RedhawkEvent } from './redhawk';

@Component({
    // moduleId: module.id,
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

    private subscription: Subscription;

    constructor(private service: RedhawkService) { }

    ngOnInit() {
        this.service.uniqueId = 'Angular-REDHAWK';
        this.subscription = this.service.model.subscribe(it => this.model = it);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
