import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { RESTConfig } from './config.service';
import { Redhawk }    from '../models/redhawk';

@Injectable()
export class RedhawkService {
    constructor(
        private http: Http,
        private rpConfig: RESTConfig
        ) {}

    public getDomainIds(): Promise<Redhawk> {
        return this.http
            .get(this.rpConfig.redhawkUrl())
            .toPromise()
            .then(response => response.json() as Redhawk)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
