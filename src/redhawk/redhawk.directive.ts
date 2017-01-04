import {
    Directive,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    Optional,
    SkipSelf
} from '@angular/core';
import { Http }       from '@angular/http';
import { Subscription } from 'rxjs/Subscription';

import { RedhawkService }        from './redhawk.service';
import { Redhawk } from './redhawk';

export function serviceSelect(service: RedhawkService, http: Http): RedhawkService {
    if (service === null) {
        service = new RedhawkService(http);
    }
    return service;
}

@Directive({
    selector: '[arRedhawk]',
    exportAs: 'arRedhawk',
    providers: [
        {
            provide: RedhawkService,
            useFactory: serviceSelect,
            deps: [
                [RedhawkService, new Optional(), new SkipSelf()],
                Http
            ]
        }
    ]
})
export class ArRedhawk implements OnInit, OnDestroy {
    @Input() serviceName: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally. 
     */
    @Input('arModel') model: Redhawk;
    @Output('arModelChange') modelChange: EventEmitter<Redhawk>;

    private subscription: Subscription;
    public get service(): RedhawkService { return this._service; }

    constructor(private _service: RedhawkService) {
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
