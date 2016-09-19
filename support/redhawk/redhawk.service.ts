import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { RESTConfig } from '../shared/config.service';
import { Redhawk }    from './redhawk';

// Other models
import { Domain }     from '../domain/domain';

@Injectable()
export class RedhawkService {

    private instance: Redhawk = new Redhawk();

    constructor(
        private http: Http,
        private rpConfig: RESTConfig
        ) { }

    public getRedhawk(): Promise<Redhawk> {
        return this.http
            .get(this.rpConfig.redhawkUrl())
            .toPromise()
            .then(response => response.json() as Redhawk)
            .catch(this.handleError);
    }

    public getDomain(domainId: string): Promise<Domain> {
        return this.http
            .get(this.rpConfig.domainUrl(domainId))
            .toPromise()
            .then(response => response.json() as Domain)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
