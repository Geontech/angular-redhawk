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

/**
 * The Domain Directive provides access to a specific Domain model
 * 
 * @example
 * <div [arDomain]="'DCE:...'" [(arModel)]="my_model">
 */
@Directive({
    selector: '[arDomain]',
    exportAs: 'arDomain',
    providers: [
        odmListenerServiceProvider(),
        domainServiceProvider()
        ]
})
export class DomainDirective implements OnDestroy, OnChanges {

    /**
     * Sets the ID for the underlying service
     */
    @Input('arDomain') domainId: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally.
     */
    @Input('arModel') model: Domain;
    @Output('arModelChange') modelChange: EventEmitter<Domain>;

    /** Internal subscription for the model */
    private subscription: Subscription = null;

    /**
     * @param service The service either imported from up the hierarchy or instantiated
     *                by this directive.
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
