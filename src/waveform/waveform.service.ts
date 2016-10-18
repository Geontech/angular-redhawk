import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Parent service & base class
import { DomainService } from '../domain/domain.service';
import { PortBearingService } from '../port/port.interface';

// URL Builders
import {
    WaveformUrl,
    ComponentUrl
} from '../shared/config.service';

// This model and helpers
import {
    Waveform,
    WaveformControlCommand,
    WaveformControlCommandResponse,
    WaveformReleaseResponse
} from './waveform';

// Child models
import { ResourceRefs } from '../shared/resource';
import { Component } from '../component/component';

@Injectable()
export class WaveformService extends PortBearingService<Waveform> {

    constructor(
        protected http: Http,
        protected domainService: DomainService
        ) { super(http); }

    setBaseUrl(url: string): void {
        this._baseUrl = WaveformUrl(this.domainService.baseUrl, url);
    }

    uniqueQuery$(): Observable<Waveform> {
        return <Observable<Waveform>> this.domainService.apps$(this.uniqueId);
    }

    public comps$(componentId?: string): Observable<Component> | Observable<ResourceRefs> {
        if (componentId) {
            return this.http
                .get(ComponentUrl(this.baseUrl, componentId))
                .map(response => response.json() as Component)
                .catch(this.handleError);
        } else {
            return this.http
                .get(ComponentUrl(this.baseUrl))
                .map(response => response.json().components as ResourceRefs)
                .catch(this.handleError);
        }
    }

    public start$(): Observable<WaveformControlCommandResponse> {
        let command = new WaveformControlCommand(true);
        return this.controlCommand$(command);
    }

    public stop$(): Observable<WaveformControlCommandResponse> {
        let command = new WaveformControlCommand(false);
        return this.controlCommand$(command);
    }

    public release$(): Observable<WaveformReleaseResponse> {
        return this.http
            .delete(this.baseUrl)
            .map(response => response.json() as WaveformReleaseResponse)
            .catch(this.handleError);
    }

    private controlCommand$(command: WaveformControlCommand): Observable<WaveformControlCommandResponse> {
        return this.http
            .put(this.baseUrl, command)
            .map(response => response.json() as WaveformControlCommandResponse)
            .catch(this.handleError);
    }
}
