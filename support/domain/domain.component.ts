import { Component, OnInit, Input, Host} from '@angular/core';

import { RedhawkService } from '../redhawk/redhawk.service';

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
    domainId: string;

    public model: Domain = new Domain();

    constructor(
        private service: DomainService, 
        @Host() private parentService: RedhawkService
        ) { }

    ngOnInit() {
        // Get domain model from the parent service
        this.service.uniqueId = this.domainId;
        this.service.model.subscribe(it => this.model = it);
    }
}
