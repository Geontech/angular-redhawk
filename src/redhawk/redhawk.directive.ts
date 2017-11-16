import {
    Directive,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Redhawk }                from '../models/index';

import { RedhawkService } from './redhawk.service';
import { redhawkServiceProvider } from './redhawk-service-provider';

/**
 * The REDHAWK Directive is the entry point, top-level directive for dependency
 * injection when accessing the REST services for a REDHAWK Domain.
 * 
 * @example
 * <div arRedhawk [(arModel)]="my_model">
 */
@Directive({
    selector: '[arRedhawk]',
    exportAs: 'arRedhawk',
    providers: [
        redhawkServiceProvider()
    ]
})
export class RedhawkDirective implements OnInit, OnDestroy {
    @Input() serviceName: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally.
     */
    @Input('arModel') model: Redhawk;
    @Output('arModelChange') modelChange: EventEmitter<Redhawk>;

    /** Internal subscription for the model */
    private subscription: Subscription;

    /**
     * @param service The service either imported from up the hierarchy or instantiated
     *                by this directive.
     */
    constructor(public service: RedhawkService) {
        this.modelChange = new EventEmitter<Redhawk>();
        this.subscription = this.service.model$.subscribe(it => {
            this.model = it;
            this.modelChange.emit(this.model);
        });
    }

    ngOnInit() {
        this.service.uniqueId = this.serviceName || 'Default';
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
