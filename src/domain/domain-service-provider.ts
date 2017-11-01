import { Optional, SkipSelf, Provider } from '@angular/core';
import { Http } from '@angular/http';

import { RestPythonService }  from '../rest-python/rest-python.module';
import { RedhawkService }     from '../redhawk/redhawk.module';
import { OdmListenerService } from '../sockets/sockets.module';

import { DomainService } from './domain.service';

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
