import { Optional, SkipSelf, Provider } from '@angular/core';
import { Http } from '@angular/http';

import { RestPythonService } from '../rest-python/rest-python.module';
import { RedhawkListenerService } from '../sockets/sockets.module';

import { RedhawkService } from './redhawk.service';

export function serviceSelect(
    service: RedhawkService,
    http: Http,
    restPython: RestPythonService,
    rhls: RedhawkListenerService): RedhawkService {
    if (service === null) {
        service = new RedhawkService(http, restPython, rhls);
    }
    return service;
}

/**
 * This is a default Service Provider factory that automatically selects the
 * "external" service (if already in the DI graph) or injects a new one using
 * the required set of external dependencies.
 */
export function redhawkServiceProvider(): Provider[] {
    return [
        RedhawkListenerService,
        {
            provide:    RedhawkService,
            useFactory: serviceSelect,
            deps: [
                [RedhawkService, new Optional(), new SkipSelf()],
                Http,
                RestPythonService,
                RedhawkListenerService
            ]
        }];
}
