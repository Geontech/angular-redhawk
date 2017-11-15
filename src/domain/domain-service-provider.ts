import { Optional, SkipSelf, Provider } from '@angular/core';
import { Http } from '@angular/http';

import { RestPythonService }  from '../rest-python/rest-python.module';
import { RedhawkService }     from '../redhawk/redhawk.module';
import { OdmListenerService } from '../sockets/sockets.module';

import { DomainService } from './domain.service';
/**
 * This method instantiates a new instance for service if none is provided.
 * @internal
 * @param [service] An existing instance of the service
 * @param http The HTTP service for server callbacks
 * @param restPython The REST Python service for URL serialization
 * @param rh The REDHAWK service that has this Domain in it
 * @param odm The ODM Listener services for the ODM Event Channel
 */
export function serviceSelect(
        service: DomainService,
        http: Http,
        restPython: RestPythonService,
        rh: RedhawkService,
        odm: OdmListenerService
    ): DomainService {
    if (service === null) {
        service = new DomainService(http, restPython, rh, odm);
    }
    return service;
}

/**
 * This is a default Service Provider factory that automatically selects the
 * "external" service (if already in the DI graph) or injects a new one using
 * the required set of external dependencies.
 */
export function domainServiceProvider(): Provider[] {
    return [
        OdmListenerService,
        {
            provide:    DomainService,
            useFactory: serviceSelect,
            deps: [
                [DomainService, new Optional(), new SkipSelf()],
                Http,
                RestPythonService,
                RedhawkService,
                OdmListenerService
            ]
        }];
}
