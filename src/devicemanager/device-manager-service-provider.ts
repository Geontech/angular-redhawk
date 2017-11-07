import { Optional, SkipSelf, Provider } from '@angular/core';
import { Http } from '@angular/http';

import { RestPythonService } from '../rest-python/rest-python.module';
import { DomainService } from '../domain/domain.module';

import { DeviceManagerService } from './device-manager.service';

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
