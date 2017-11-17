import { ReflectiveInjector } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { PortRef } from './port.ref';

/**
 * Generic FEI Device that queries (Http) against the port to fetch its
 * extended information.  This is simply a base class for the other FEI types.
 */
export class FeiRef extends PortRef {
    /** The HTTP service being used with this port reference */
    public http: Http;

    /**
     * Constructor
     * @param url The URL of the port.
     */
    constructor (public url: string) {
        super(url);
        let providers = ReflectiveInjector.resolve([Http]);
        let injector = ReflectiveInjector.fromResolvedProviders(providers);
        this.http = injector.get(Http);
    }

    /**
     * Queries the FEI port for the named parameter.
     */
    protected query$(param?: string): Observable<any> {
        let target: string = this.url;
        if (param) {
            target = target + '/' + param;
        }
        return this.http
            .get(target)
            .map(response => response.json());
    }
}
