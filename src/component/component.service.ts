import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

// Base class, served model, and properties
import { Component, PropertySet } from '../models/index';
import { PortBearingService }     from '../base/index';
import { PropertyCommand }        from '../property/property.module';

// URL Builder
import { RestPythonService } from '../rest-python/rest-python.module';

// Parent service & base class
import { WaveformService } from '../waveform/waveform.module';

/**
 * The default delay in checking for a server response when using configure,
 * allocate, or deallocate.
 */
let DEFAULT_DELAY_RESPONSE_MS = 10000;

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

    /**
     * Calls 'configure' on the Device and then pulls an update of the model.
     * @param properties The properties to 'configure' on the Device
     * @param responseDelayMs The optional model update delay after sending the 
     * changes.
     */
    configure(properties: PropertySet, delayResponseMs?: number): void {
        let command = new PropertyCommand(properties);
        this.http.put(this.restPython.propertyUrl(this.baseUrl), command);
        this.delayedUpdate(delayResponseMs || DEFAULT_DELAY_RESPONSE_MS);
    }
}
