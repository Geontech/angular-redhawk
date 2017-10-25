import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Model, base class, other external modules
import { Waveform, Component, ResourceRefs } from '../models/index';
import { RestPythonService }                 from '../rest-python/rest-python.module';
import { PortBearingService }                from '../base/index';
import { DomainService }                     from '../domain/domain.module';

// C&C interfaces
import { IWaveformControlCommand }         from './waveform-control-command';
import { IWaveformControlCommandResponse } from './waveform-control-command-response';
import { IWaveformReleaseResponse }        from './waveform-release-response';

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
        this._baseUrl = this.restPython.waveformUrl(this.domainService.baseUrl, url);
    }

    uniqueQuery$(): Observable<Waveform> {
        return <Observable<Waveform>> this.domainService.apps$(this.uniqueId);
    }

    public comps$(componentId?: string): Observable<Component> | Observable<ResourceRefs> {
        if (componentId) {
            return this.http
                .get(this.restPython.componentUrl(this.baseUrl, componentId))
                .map(response => response.json() as Component)
                .catch(this.handleError);
        } else {
            return this.http
                .get(this.restPython.componentUrl(this.baseUrl))
                .map(response => response.json().components as ResourceRefs)
                .catch(this.handleError);
        }
    }

    public start$(): Observable<IWaveformControlCommandResponse> {
        let command: IWaveformControlCommand = { started: true };
        return this.controlCommand$(command);
    }

    public stop$(): Observable<IWaveformControlCommandResponse> {
        let command: IWaveformControlCommand = { started: false };
        return this.controlCommand$(command);
    }

    public release$(): Observable<IWaveformReleaseResponse> {
        return this.http
            .delete(this.baseUrl)
            .map(response => response.json() as IWaveformReleaseResponse)
            .catch(this.handleError);
    }

    private controlCommand$(command: IWaveformControlCommand): Observable<IWaveformControlCommandResponse> {
        return this.http
            .put(this.baseUrl, command)
            .map(response => response.json() as IWaveformControlCommandResponse)
            .catch(this.handleError);
    }
}
