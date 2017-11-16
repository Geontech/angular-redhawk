import { Optional, SkipSelf, Provider } from '@angular/core';
import { Http } from '@angular/http';

import { RestPythonService } from '../rest-python/rest-python.module';
import { DomainService } from '../domain/domain.module';

import { DeviceManagerService } from './device-manager.service';

/**
 * This method instantiates a new instance for service if none is provided.
 * @param [service] An existing instance of the service
 * @param http The HTTP service for server callbacks
 * @param restPython The REST Python service for URL serialization
 * @param domain The Domain service that has this DeviceManager in it
 */
export function serviceSelect(
        service: DeviceManagerService,
        http: Http,
        restPython: RestPythonService,
        domain: DomainService
): DeviceManagerService {
    if (service === null) {
        service = new DeviceManagerService(http, restPython, domain);
    }
    return service;
}

/**
 * This is a default Service Provider factory that automatically selects the
 * "external" service (if already in the DI graph) or injects a new one using
 * the required set of external dependencies.
 */
export function deviceManagerServiceProvider(): Provider[] {
    return [{
        provide: DeviceManagerService,
        useFactory: serviceSelect,
        deps: [
            [DeviceManagerService, new Optional(), new SkipSelf()],
            Http,
            RestPythonService,
            DomainService
        ]
    }];
}
