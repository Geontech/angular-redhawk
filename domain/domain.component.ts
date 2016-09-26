import { Component, OnInit, OnDestroy, Input, Host} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { RedhawkService } from '../redhawk/redhawk.service';

import { DomainService } from './domain.service';
import { Domain }        from './domain';

@Component({
    moduleId: module.id,
    selector: 'ar-domain',
    template: `
        <ng-content></ng-content>
        `,
    providers: [ DomainService ]
})

export class ArDomain implements OnInit, OnDestroy {

    @Input()
    domainId: string;

    public model: Domain = new Domain();

    private subscription: Subscription;

    constructor(
        private service: DomainService, 
        @Host() private parentService: RedhawkService
        ) { }

    ngOnInit() {
        // Get domain model from the parent service
        this.service.uniqueId = this.domainId;
        this.subscription = this.service.model.subscribe(it => this.model = it);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
