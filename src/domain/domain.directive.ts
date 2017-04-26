import {
    Directive,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    Input,
    Output,
    EventEmitter,
    Optional,
    SkipSelf
} from '@angular/core';
import { Http }       from '@angular/http';
import { Subscription } from 'rxjs/Subscription';

import { RedhawkService } from '../redhawk/redhawk.service';
import { DomainService } from './domain.service';
import { Domain }        from './domain';

import { OdmListenerService } from '../sockets/odm/odm.listener.service';

export function serviceSelect(
        service: DomainService,
        http: Http,
        rh: RedhawkService,
        odm: OdmListenerService
    ): DomainService {
    if (service === null) {
        service = new DomainService(http, rh, odm);
    }
    return service;
}

@Directive({
    selector: '[arDomain]',
    exportAs: 'arDomain',
    providers: [
        OdmListenerService,
        {
            provide:    DomainService,
            useFactory: serviceSelect,
            deps: [
                [DomainService, new Optional(), new SkipSelf()],
                Http,
                RedhawkService,
                OdmListenerService
            ]
        }
        ]
})
export class DomainDirective implements OnDestroy, OnChanges {

    @Input('arDomain') domainId: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally.
     */
    @Input('arModel') model: Domain;
    @Output('arModelChange') modelChange: EventEmitter<Domain>;

    private subscription: Subscription = null;

    /**
     * The directive tries to use the parent's DomainService, if provided.
     * If not, it injects its own.
     */
    constructor(public service: DomainService) {
        this.modelChange = new EventEmitter<Domain>();
        this.model = new Domain();
    }

    ngOnChanges(changes: SimpleChanges) {
        const domainId: string = 'domainId';
        if (changes.hasOwnProperty(domainId)) {
            this.service.setUniqueId(this.domainId);

            // Connect to the service if necessary
            if (!this.subscription) {
                this.subscription = this.service.model$().subscribe(it => {
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
