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

// This model, rest service, and provider
import { Port }                from '../models/index';
import { PortService }         from './port.service';
import { portServiceProvider } from './port-service-provider';

/**
 * The Port directive provides access to the variety of port types in REDHAWK.
 * Port-specific features can be accessed through the 'service'.
 * 
 * @example
 * <div [arPort]="'dataShort_out'" [(arModel)]="my_model">
 */
@Directive({
    selector: '[arPort]',
    exportAs: 'arPort',
    providers: [ portServiceProvider() ]
})
export class PortDirective implements OnDestroy, OnChanges {

    /**
     * Sets the ID for the underlying service
     */
    @Input('arPort') portId: string;

    /** Setter for "Banana in a Box Syntax"  */
    @Input('arModel') model: Port;
    /** Emitter for "Banana in a Box Syntax"  */
    @Output('arModelChange') modelChange: EventEmitter<Port>;

    /** Internal subscription for the model */
    private subscription: Subscription = null;

    /**
     * Constructor
     * @param service The service either imported from up the hierarchy or instantiated
     *                by this directive.
     */
    constructor(public service: PortService) {
        this.modelChange = new EventEmitter<Port>();
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
        if (changes.hasOwnProperty('portId') && this.portId) {
            this.service.uniqueId = this.portId;
        }
    }

    /**
     * Implementation of the OnDestroy interface unsubscribes from the model observable.
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
