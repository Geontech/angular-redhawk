import {
    Directive,
    OnInit,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    Input,
    Host
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { RedhawkService } from '../redhawk/redhawk.service';

import { DomainService } from './domain.service';
import { Domain }        from './domain';

@Directive({
    selector: '[arDomain]',
    providers: [ DomainService ]
})

export class ArDomain implements OnInit, OnDestroy, OnChanges {

    @Input('arDomain') domainId: string;

    public model: Domain = new Domain();

    private subscription: Subscription = null;

    constructor(
        private service: DomainService,
        @Host() private parentService: RedhawkService
        ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('arDomain')) {
            this.service.uniqueId = this.domainId;
            if (!this.subscription) {
                this.subscription = this.service.model.subscribe(it => this.model = it);
            }
        }
    }

    ngOnInit() { /** */ }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
