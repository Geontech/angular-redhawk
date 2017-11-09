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
 */
@Directive({
    selector: '[arComponent]',
    exportAs: 'arComponent',
    providers: [ componentServiceProvider() ]
})
export class ComponentDirective implements OnDestroy, OnChanges {

    @Input('arComponent') componentId: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally.
     */
    @Input('arModel') model: Component;
    @Output('arModelChange') modelChange: EventEmitter<Component>;

    private subscription: Subscription = null;

    constructor(public service: ComponentService) {
        this.modelChange = new EventEmitter<Component>();
        this.subscription = this.service.model$.subscribe(it => {
            this.model = it;
            this.modelChange.emit(this.model);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('componentId') && this.componentId) {
            this.service.uniqueId = this.componentId;
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
