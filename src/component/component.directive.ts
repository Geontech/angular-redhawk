import {
    Directive,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    Input,
    Output,
    EventEmitter,
    Optional,
    Inject
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ComponentService } from './component.service';
import { Component } from './component';

@Directive({
    selector: '[arComponent]',
    exportAs: 'arComponent',
    providers: [ { provide: 'DefaultComponentService', useClass: ComponentService } ]
})

export class ArComponent implements OnDestroy, OnChanges {

    @Input('arComponent') componentId: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally. 
     */
    @Input('arModel') model: Component;
    @Output('arModelChange') modelChange: EventEmitter<Component>;

    public get service(): ComponentService { return this._service; }

    private subscription: Subscription = null;
    private _service: ComponentService;

    constructor(
        @Inject('DefaultComponentService') local: ComponentService,
        @Optional() host: ComponentService) {
            this._service = host ? host : local;
            this.modelChange = new EventEmitter<Component>();
            this.model = new Component();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('componentId')) {
            this.service.uniqueId = this.componentId;
            if (!this.subscription) {
                this.subscription = this.service.model$.subscribe(it => {
                    this.model = it;
                    this.modelChange.emit(this.model);
                });
            }
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
