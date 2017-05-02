import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Parent service & base class
import { WaveformService } from '../waveform/waveform.service';
import { PortBearingService } from '../port/port.interface';

// URL Builder
import { RestPythonService } from '../shared/rest.python.service';

// This model
import { Component }  from './component';

// Child models
import { PropertySet, PropertyCommand } from '../property/property';

@Injectable()
export class ComponentService extends PortBearingService<Component> {

    constructor(
        protected http: Http,
        protected restPython: RestPythonService,
        protected waveformService: WaveformService
        ) { super(http, restPython); }

    setBaseUrl(url: string): void {
        this._baseUrl = this.restPython.componentUrl(this.waveformService.getBaseUrl(), url);
    }

    uniqueQuery$(): Observable<Component> {
        return <Observable<Component>> this.waveformService.comps$(this.getUniqueId());
    }

    configure(properties: PropertySet): void {
        let command = new PropertyCommand(properties);
        this.http.put(this.restPython.propertyUrl(this.getBaseUrl()), command);
        this.delayedUpdate();
    }
}
