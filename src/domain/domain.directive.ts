import {
    Directive,
    OnInit,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    Input
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { RedhawkService } from '../redhawk/redhawk.service';

import { DomainService } from './domain.service';
import { Domain }        from './domain';

@Directive({
    selector: '[arDomain]',
    exportAs: 'arDomain',
    providers: [ DomainService ]
})
export class ArDomainDirective implements OnInit, OnDestroy, OnChanges {

    @Input('arDomain') domainId: string;

    public model: Domain = new Domain();

    private subscription: Subscription = null;

    constructor(
        private service: DomainService,
        private parentService: RedhawkService
        ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('domainId')) {
            this.service.uniqueId = this.domainId;
            if (!this.subscription) {
                this.subscription = this.service.model$.subscribe(it => this.model = it);
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
