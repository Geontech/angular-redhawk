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

// This service
import { PortService } from './port.service';

// This model
import { Port } from './port';

@Directive({
    selector: '[arPort]',
    exportAs: 'arPort',
    providers: [ { provide: 'DefaultPortService', useClass: PortService } ]
})
export class ArPort implements OnDestroy, OnChanges {

    @Input('arPort') portId: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally. 
     */
    @Input('arModel') model: Port;
    @Output('arModelChange') modelChange: EventEmitter<Port>;

    public get service(): PortService { return this._service; }

    private subscription: Subscription = null;
    private _service: PortService;

    constructor(
        @Inject('DefaultPortService') local: PortService,
        @Optional() host: PortService) {
            this._service = host ? host : local;
            this.modelChange = new EventEmitter<Port>();
            this.model = new Port();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('portId')) {
            this.service.uniqueId = this.portId;
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
