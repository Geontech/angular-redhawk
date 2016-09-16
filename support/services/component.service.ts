import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { RESTConfig } from './config.service';
import { Component } from '../models/component';


@Injectable()
export class ComponentService {
    constructor(
        private http: Http,
        private rpConfig: RESTConfig
        ) {}

    public getComponent(domainId: string, waveformId: string, componentId: string): Promise<Component> {
        return this.http
            .get(this.rpConfig.componentUrl(domainId, waveformId, componentId))
            .toPromise()
            .then(response => response.json() as Component)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
