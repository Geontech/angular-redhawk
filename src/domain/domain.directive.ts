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

import { DomainService } from './domain.service';
import { Domain }        from './domain';

@Directive({
    selector: '[arDomain]',
    exportAs: 'arDomain',
    providers: [ { provide: 'DefaultDomainService', useClass: DomainService } ]
})
export class ArDomain implements OnDestroy, OnChanges {

    @Input('arDomain') domainId: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally. 
     */
    @Input('arModel') model: Domain;
    @Output('arModelChange') modelChange: EventEmitter<Domain>;

    public get service(): DomainService { return this._service; }

    private subscription: Subscription = null;
    private _service: DomainService;

    constructor(
            @Inject('DefaultDomainService') local: DomainService,
            @Optional() host: DomainService) {
        this._service = host ? host : local;
        this.modelChange = new EventEmitter<Domain>();
        this.model = new Domain();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('domainId')) {
            this.service.uniqueId = this.domainId;
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
