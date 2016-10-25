import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { BaseService } from '../shared/base.service';
import { RedhawkUrl, DomainUrl } from '../shared/config.service';
import { Redhawk }    from './redhawk';

// Other models
import { Domain }     from '../domain/domain';

@Injectable()
export class RedhawkService extends BaseService<Redhawk> {

    constructor(protected http: Http) { super(http); }

    setBaseUrl(url: string): void {
        this._baseUrl = RedhawkUrl();
    }

    uniqueQuery$(): Observable<Redhawk> {
        return this.http
            .get(DomainUrl(this.baseUrl))
            .map(res => new Redhawk().deserialize(res.json()))
            .catch(this.handleError);
    }

    // Get a list of online domain names
    public scan$(): Observable<string[]> {
        return this.http
            .get(DomainUrl(this.baseUrl))
            .map(response => response.json().domains as string[])
            .catch(this.handleError);
    }

    // Get the named domain model
    public attach$(domainId: string): Observable<Domain> {
        return this.http
            .get(DomainUrl(this.baseUrl, domainId))
            .map(response => new Domain().deserialize(response.json()))
            .catch(this.handleError);
    }
}
