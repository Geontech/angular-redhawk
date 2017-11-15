import { Optional, SkipSelf, Provider } from '@angular/core';
import { Http } from '@angular/http';

import { RestPythonService }    from '../rest-python/rest-python.module';
import { DeviceManagerService } from '../devicemanager/device-manager.module';

import { DeviceService } from './device.service';

/**
 * This method instantiates a new instance for service if none is provided.
 * @internal
 * @param [service] An existing instance of the service
 * @param http The HTTP service for server callbacks
 * @param restPython The REST Python service for URL serialization
 * @param dm The DeviceManager service that has this Device in it
 */
export function serviceSelect (
    service: DeviceService,
    http: Http,
    restPython: RestPythonService,
    dm: DeviceManagerService
): DeviceService {
    if (service === null) {
        service = new DeviceService(http, restPython, dm);
    }
    return service;
}

/**
 * This is a default Service Provider factory that automatically selects the
 * "external" service (if already in the DI graph) or injects a new one using
 * the required set of external dependencies.
 */
export function deviceServiceProvider(): Provider[] {
    return [{
        provide:    DeviceService,
        useFactory: serviceSelect,
        deps: [
            [DeviceService, new Optional(), new SkipSelf()],
            Http,
            RestPythonService,
            DeviceManagerService
        ]
    }];
}
