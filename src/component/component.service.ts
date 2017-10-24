import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Base class, served model, and properties
import { Component, PropertySet } from '../models/index';
import { PortBearingService }     from '../base/index';
import { PropertyCommand }        from '../property/property.module';

// URL Builder
import { RestPythonService } from '../rest-python/rest-python.module';

// Parent service & base class
import { WaveformService } from '../waveform/waveform.module';

/**
 * The Component Service provides the service interface to a specific Component
 * model in a REDHAWK system
 */
@Injectable()
export class ComponentService extends PortBearingService<Component> {

    constructor(
        protected http: Http,
        protected restPython: RestPythonService,
        protected waveformService: WaveformService
        ) { super(http, restPython); }

    setBaseUrl(url: string): void {
        this._baseUrl = this.restPython.componentUrl(this.waveformService.baseUrl, url);
    }

    uniqueQuery$(): Observable<Component> {
        return <Observable<Component>> this.waveformService.comps$(this.uniqueId);
    }

    configure(properties: PropertySet): void {
        let command = new PropertyCommand(properties);
        this.http.put(this.restPython.propertyUrl(this.baseUrl), command);
        this.delayedUpdate();
    }
}
