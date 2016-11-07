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

import { WaveformService } from './waveform.service';
import { Waveform }        from './waveform';

@Directive({
    selector: '[arWaveform]',
    exportAs: 'arWaveform',
    providers: [ {provide: 'DefaultWaveformService', useClass: WaveformService } ]
})
export class ArWaveform implements OnDestroy, OnChanges {

    @Input('arWaveform') waveformId: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally. 
     */
    @Input('arModel') model: Waveform;
    @Output('arModelChange') modelChange: EventEmitter<Waveform>;

    public get service(): WaveformService { return this._service; }

    private subscription: Subscription = null;
    private _service: WaveformService;

    constructor(
        @Inject('DefaultWaveformService') local: WaveformService,
        @Optional() host: WaveformService) {
            this._service = host ? host : local;
            this.modelChange = new EventEmitter<Waveform>();
            this.model = new Waveform();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('waveformId')) {
            this.service.uniqueId = this.waveformId;
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
