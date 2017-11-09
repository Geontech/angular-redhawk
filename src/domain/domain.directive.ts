import {
    Directive,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Domain } from '../models/index';
import { odmListenerServiceProvider } from '../sockets/sockets.module';

import { DomainService } from './domain.service';
import { domainServiceProvider } from './domain-service-provider';

@Directive({
    selector: '[arDomain]',
    exportAs: 'arDomain',
    providers: [
        odmListenerServiceProvider(),
        domainServiceProvider()
        ]
})
export class DomainDirective implements OnDestroy, OnChanges {

    @Input('arDomain') domainId: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally.
     */
    @Input('arModel') model: Domain;
    @Output('arModelChange') modelChange: EventEmitter<Domain>;

    private subscription: Subscription = null;

    /**
     * The directive tries to use the parent's DomainService, if provided.
     * If not, it injects its own.
     */
    constructor(public service: DomainService) {
        this.modelChange = new EventEmitter<Domain>();
        this.subscription = this.service.model$.subscribe(it => {
            this.model = it;
            this.modelChange.emit(this.model);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        const domainId = 'domainId';
        if (changes.hasOwnProperty(domainId) && this.domainId !== undefined) {
            this.service.uniqueId = this.domainId;
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
