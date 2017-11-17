import {
    Injectable,
    Optional,
    ReflectiveInjector
} from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Domain, Redhawk, RedhawkEvent } from '../models/index';
import { RestPythonService }             from '../rest-python/rest-python.module';
import { BaseService }                   from '../base/index';
import { RedhawkListenerService }        from '../sockets/sockets.module';

/**
 * The REDHAWK Service provides access to the REDHAWK Model on the REST server as well as
 * serves as the starting point for the Depenency Injection (DI) hierarchy of other services
 * such as {@link DomainService}, {@link DeviceManagerService}, and so on.
 */
@Injectable()
export class RedhawkService extends BaseService<Redhawk> {

    /**
     * Constructor
     * @param http The HTTP service for REST calls
     * @param restPython The REST Python URL service
     * @param rhListenerService The REDHAWK (Domain) Listener Service
     */
    constructor(
        protected http: Http,
        protected restPython: RestPythonService,
        @Optional() protected rhListenerService: RedhawkListenerService
    ) {
        super(http, restPython);
        this.modelUpdated(new Redhawk());
        this.setBaseUrl('');

        if (this.rhListenerService === null) {
            let injector = ReflectiveInjector.resolveAndCreate([RedhawkListenerService]);
            this.rhListenerService = injector.get(RedhawkListenerService);
        }

        this.rhListenerService.events$.subscribe((rh: RedhawkEvent) => {
            this._model.next(rh);
        });
    }

    /**
     * Internal, sets up the base URL
     * @param url IGNORED
     */
    setBaseUrl(url: string): void {
        this._baseUrl = this.restPython.redhawkUrl();
    }

    /**
     * Internal, initiates the server call that uniquely identifies this entity
     * to retrieve its model.
     */
    uniqueQuery$(): Observable<Redhawk> {
        return this.http
            .get(this.restPython.domainUrl(this.baseUrl))
            .map(res => new Redhawk().deserialize(res.json()))
            .catch(this.handleError);
    }

    /** Get a list of online domain names */
    public scan$(): Observable<string[]> {
        return this.http
            .get(this.restPython.domainUrl(this.baseUrl))
            .map(response => response.json().domains as string[])
            .catch(this.handleError);
    }

    /**
     * Retrieves a Domain model
     * @param domainId The Domain model to fetch (this corresponds to the Domain's "name")
     */
    public attach$(domainId: string): Observable<Domain> {
        return this.http
            .get(this.restPython.domainUrl(this.baseUrl, domainId))
            .map(response => new Domain().deserialize(response.json()))
            .catch(this.handleError);
    }

    /** Get a list of online Event Channels */
    public scanChannels$(): Observable<string[]> {
        return this.http
            .get(this.restPython.eventChannelsUrl())
            .map(response => response.json().eventChannels as string[])
            .catch(this.handleError);
    }
}
