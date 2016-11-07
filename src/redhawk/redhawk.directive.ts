import {
    Directive,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    Optional,
    Inject
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { RedhawkService }        from './redhawk.service';
import { Redhawk } from './redhawk';

@Directive({
    selector: '[arRedhawk]',
    exportAs: 'arRedhawk',
    providers: [ {provide: 'DefaultRedhawkService', useClass: RedhawkService } ]
})
export class ArRedhawk implements OnInit, OnDestroy {
    @Input() serviceName: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally. 
     */
    @Input('arModel') model: Redhawk;
    @Output('arModelChange') modelChange: EventEmitter<Redhawk>;

    private subscription: Subscription;
    private _service: RedhawkService;
    public get service(): RedhawkService { return this._service; }

    constructor(
        @Inject('DefaultRedhawkService') local: RedhawkService,
        @Optional() host: RedhawkService) {
            this._service = host ? host : local;
            this.modelChange = new EventEmitter<Redhawk>();
            this.model = new Redhawk();
    }

    ngOnInit() {
        this.service.uniqueId = this.serviceName || 'UI Kit';
        this.subscription = this.service.model$.subscribe(it => {
            this.model = it;
            this.modelChange.emit(this.model);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
