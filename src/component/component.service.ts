import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Parent service & base class
import { WaveformService } from '../waveform/waveform.service';
import { PortBearingService } from '../port/port.interface';

// URL Builders
import {
    ComponentUrl,
    PropertyUrl
} from '../shared/config.service';

// This model
import { Component }  from './component';

// Child models
import { PropertySet, PropertyCommand } from '../property/property';

@Injectable()
export class ComponentService extends PortBearingService<Component> {

    constructor(
        protected http: Http,
        protected waveformService: WaveformService
        ) { super(http); }

    setBaseUrl(url: string): void {
        this._baseUrl = ComponentUrl(this.waveformService.baseUrl, url);
    }

    uniqueQuery$(): Observable<Component> {
        return <Observable<Component>> this.waveformService.comps$(this.uniqueId);
    }

    configure(properties: PropertySet): void {
        let command = new PropertyCommand(properties);
        this.http.put(PropertyUrl(this.baseUrl), command);
    }
}
