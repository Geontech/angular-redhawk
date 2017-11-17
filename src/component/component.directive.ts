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

import { Component } from '../models/index';

// This service
import { ComponentService } from './component.service';
import { componentServiceProvider } from './component-service-provider';

/**
 * The Component Directive provides access to a specific Component model including
 * the configuration of its properties and access to its ports.
 * 
 * @example
 * <div [arComponent]="'DCE:...'" [(arModel)]="my_model">
 */
@Directive({
    selector: '[arComponent]',
    exportAs: 'arComponent',
    providers: [ componentServiceProvider() ]
})
export class ComponentDirective implements OnDestroy, OnChanges {

    /**
     * Sets the ID for the underlying service
     */
    @Input('arComponent') componentId: string;

    /** Setter for "Banana in a Box Syntax"  */
    @Input('arModel') model: Component;
    /** Emitter for "Banana in a Box Syntax"  */
    @Output('arModelChange') modelChange: EventEmitter<Component>;

    /** Internal subscription for the model */
    private subscription: Subscription = null;

    /**
     * Constructor
     * @param service The service either imported from up the hierarchy or instantiated
     *                by this directive.
     */
    constructor(public service: ComponentService) {
        this.modelChange = new EventEmitter<Component>();
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
        if (changes.hasOwnProperty('componentId') && this.componentId) {
            this.service.uniqueId = this.componentId;
        }
    }

    /**
     * Implementation of the OnDestroy interface unsubscribes from the model observable.
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
