import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { RESTConfig } from './config.service';
import { Domain } from '../models/domain';


@Injectable()
export class DomainService {
    constructor(
        private http: Http,
        private rpConfig: RESTConfig
        ) {}

    public getDomain(domainId: string): Promise<Domain> {
        return this.http
            .get(this.rpConfig.domainUrl(domainId))
            .toPromise()
            .then(response => response.json() as Domain)
            .catch(this.handleError);
    }

    public launch(domainId: string, waveformId: string) {
        // TODO: Implement
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
