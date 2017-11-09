import { Provider } from '@angular/core';
import { Http } from '@angular/http';

import { DomainService } from '../../domain/domain.module';
import { OdmListenerService, odmListenerServiceProvider } from '../../sockets/sockets.module';
import { RedhawkService, redhawkServiceProvider } from '../../redhawk/redhawk.module';
import { RestPythonService } from '../../rest-python/rest-python.module';

/**
 * Domain(Service) Factory returns a new instance of the DomainService.
 * @param http The Http Service
 * @param restPython The RestPythonService
 * @param redhawk The REDHAWK Service
 * @param odm The ODM Listener Service
 */
export function domainFactory(
    http: Http,
    restPython: RestPythonService,
    redhawk: RedhawkService,
    odm: OdmListenerService
) {
    return new DomainService(http, restPython, redhawk, odm);
}

/**
 * Returns a provider for a domain service mapped to the token specified.
 * @param token InjectionToken, string or class to represent this instance
 */
export function domainProvider(token: any): Provider[] {
    return [
        redhawkServiceProvider(),
        odmListenerServiceProvider(),
        {
            provide: token,
            useFactory: domainFactory,
            deps: [
                Http,
                RestPythonService,
                RedhawkService,
                OdmListenerService
            ]
        }
    ];
}
