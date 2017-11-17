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

    /** Setter for "Banana in a Box Syntax"  */
    @Input('arModel') model: Domain;
    /** Emitter for "Banana in a Box Syntax"  */
    @Output('arModelChange') modelChange: EventEmitter<Domain>;

    /** Internal subscription for the model */
    private subscription: Subscription = null;

    /**
     * Constructor
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

    /**
     * Implementation of the OnChanges interface updates the service's uniqueID
     * @param changes The changes made to this component
     */
    ngOnChanges(changes: SimpleChanges) {
        const domainId = 'domainId';
        if (changes.hasOwnProperty(domainId) && this.domainId !== undefined) {
            this.service.uniqueId = this.domainId;
        }
    }

    /**
     * Implementation of the OnDestroy interface unsubscribes from the model observable.
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
