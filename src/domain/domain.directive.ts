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

import { OdmListenerService } from '../sockets/odm.listener.service';

@Directive({
    selector: '[arDomain]',
    exportAs: 'arDomain',
    providers: [
        OdmListenerService,
        { provide: 'DefaultDomainService', useClass: DomainService }
        ]
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
    private odmListener: OdmListenerService;

    constructor(
            odmListener: OdmListenerService,
            @Inject('DefaultDomainService') local: DomainService,
            @Optional() host: DomainService) {
        this._service = host ? host : local;
        this.modelChange = new EventEmitter<Domain>();
        this.model = new Domain();

        this.odmListener = odmListener;
        this.odmListener.events$.subscribe(o => {
            this.service.update();
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        const domainId: string = 'domainId';
        if (changes.hasOwnProperty(domainId)) {
            this.service.uniqueId = this.domainId;

            // Connect to the service if necessary
            if (!this.subscription) {
                this.subscription = this.service.model$.subscribe(it => {
                    this.model = it;
                    this.modelChange.emit(this.model);
                });
            }

            // Update the websocket connection
            let previous: any = changes[domainId].previousValue;
            if (typeof previous === 'string' || previous instanceof String) {
                this.odmListener.disconnect('' + previous);
            }
            this.odmListener.connect(this.domainId);
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
