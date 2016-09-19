import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { RESTConfig }    from '../shared/config.service';
import { CFPropertySet } from '../shared/property';
import { Domain }        from './domain';


@Injectable()
export class DomainService {

    constructor(
        private http: Http,
        private rpConfig: RESTConfig
        ) {}

    public configure(domainId: string, properties: CFPropertySet): Promise<any> {
        return this.http
             .put(this.rpConfig.domainUrl(domainId), properties)
             .toPromise()
             .then(response => response.json())
             .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
