import { Injectable, Optional} from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Possible parent services
import { WaveformService } from '../waveform/waveform.service';
import { DeviceService } from '../device/device.service';
import { ComponentService } from '../component/component.service';

// And base service
import { BaseService } from '../shared/base.service';

// URL Builders
import {
    PortUrl
} from '../shared/config.service';

// This model
import { Port } from './port';

@Injectable()
export class PortService extends BaseService<Port> {

    protected parent: WaveformService | DeviceService | ComponentService;

    constructor(
        protected http: Http,
        @Optional() private _wave: WaveformService,
        @Optional() private _device: DeviceService,
        @Optional() private _component: ComponentService
        ) {
        super(http);
        if (_wave) {
            this.parent = _wave;
        } else if (_device) {
            this.parent = _device;
        } else if (_component) {
            this.parent = _component;
        } else {
            console.error('Failed to provide a port bearing service');
        }
    }

    setBaseUrl(url: string): void {
        this._baseUrl = PortUrl(this.parent.baseUrl, this.uniqueId);
    }

    uniqueQuery$(): Observable<Port> {
        return <Observable<Port>> this.parent.ports$(this.uniqueId);
    }

    connect(): void {
        // FIXME: Add websocket interface
    }

    disconnect(): void {
        // FIXME: Add websocket interface
    }
}
