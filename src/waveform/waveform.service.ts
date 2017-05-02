import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Parent service & base class
import { DomainService } from '../domain/domain.service';
import { PortBearingService } from '../port/port.interface';

// URL Builder
import { RestPythonService } from '../shared/rest.python.service';

// This model and helpers
import {
    Waveform,
    WaveformControlCommand,
    IWaveformControlCommandResponse,
    IWaveformReleaseResponse
} from './waveform';

// Child models
import { ResourceRefs } from '../shared/resource';
import { Component } from '../component/component';

@Injectable()
export class WaveformService extends PortBearingService<Waveform> {

    constructor(
        protected http: Http,
        protected restPython: RestPythonService,
        protected domainService: DomainService
        ) {
        super(http, restPython);
    }

    setBaseUrl(url: string): void {
        this._baseUrl = this.restPython.waveformUrl(this.domainService.getBaseUrl(), url);
    }

    uniqueQuery$(): Observable<Waveform> {
        return <Observable<Waveform>> this.domainService.apps$(this.getUniqueId());
    }

    public comps$(componentId?: string): Observable<Component> | Observable<ResourceRefs> {
        if (componentId) {
            return this.http
                .get(this.restPython.componentUrl(this.getBaseUrl(), componentId))
                .map(response => response.json() as Component)
                .catch(this.handleError);
        } else {
            return this.http
                .get(this.restPython.componentUrl(this.getBaseUrl()))
                .map(response => response.json().components as ResourceRefs)
                .catch(this.handleError);
        }
    }

    public start$(): Observable<IWaveformControlCommandResponse> {
        let command = new WaveformControlCommand(true);
        return this.controlCommand$(command);
    }

    public stop$(): Observable<IWaveformControlCommandResponse> {
        let command = new WaveformControlCommand(false);
        return this.controlCommand$(command);
    }

    public release$(): Observable<IWaveformReleaseResponse> {
        return this.http
            .delete(this.getBaseUrl())
            .map(response => response.json() as IWaveformReleaseResponse)
            .catch(this.handleError);
    }

    private controlCommand$(command: WaveformControlCommand): Observable<IWaveformControlCommandResponse> {
        return this.http
            .put(this.getBaseUrl(), command)
            .map(response => response.json() as IWaveformControlCommandResponse)
            .catch(this.handleError);
    }
}
