import {
    Injectable,
    Optional,
    ReflectiveInjector
} from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { RestPythonService } from '../rest-python/rest-python.module';

import { BaseService } from '../base/base.service';
import { Redhawk, RedhawkEvent } from './redhawk';

// Other models
import { Domain }     from '../domain/domain';

// Websocket service
import { RedhawkListenerService } from '../sockets/redhawk.listener.service';

@Injectable()
export class RedhawkService extends BaseService<Redhawk> {

    constructor(
        protected http: Http,
        protected restPython: RestPythonService,
        @Optional() protected rhListenerService: RedhawkListenerService) {
        super(http, restPython);

        if (this.rhListenerService === null) {
            let injector = ReflectiveInjector.resolveAndCreate([RedhawkListenerService]);
            this.rhListenerService = injector.get(RedhawkListenerService);
        }

        this.rhListenerService.getEvents$().subscribe((rh: RedhawkEvent) => {
            this._model.next(rh);
        });
    }

    setBaseUrl(url: string): void {
        this._baseUrl = this.restPython.redhawkUrl();
    }

    uniqueQuery$(): Observable<Redhawk> {
        return this.http
            .get(this.restPython.domainUrl(this.baseUrl))
            .map(res => new Redhawk().deserialize(res.json()))
            .catch(this.handleError);
    }

    // Get a list of online domain names
    public scan$(): Observable<string[]> {
        return this.http
            .get(this.restPython.domainUrl(this.baseUrl))
            .map(response => response.json().domains as string[])
            .catch(this.handleError);
    }

    // Get the named domain model
    public attach$(domainId: string): Observable<Domain> {
        return this.http
            .get(this.restPython.domainUrl(this.baseUrl, domainId))
            .map(response => new Domain().deserialize(response.json()))
            .catch(this.handleError);
    }

    // Get a list of online Event Channels
    public scanChannels$(): Observable<string[]> {
        return this.http
            .get(this.restPython.eventChannelsUrl())
            .map(response => response.json().eventChannels as string[])
            .catch(this.handleError);
    }
}
