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
 */
@Directive({
    selector: '[arPort]',
    exportAs: 'arPort',
    providers: [ portServiceProvider() ]
})
export class PortDirective implements OnDestroy, OnChanges {

    @Input('arPort') portId: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally.
     */
    @Input('arModel') model: Port;
    @Output('arModelChange') modelChange: EventEmitter<Port>;

    private subscription: Subscription = null;

    constructor(public service: PortService) {
        this.modelChange = new EventEmitter<Port>();
        this.subscription = this.service.model$.subscribe(it => {
            this.model = it;
            this.modelChange.emit(this.model);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('portId') && this.portId) {
            this.service.uniqueId = this.portId;
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
