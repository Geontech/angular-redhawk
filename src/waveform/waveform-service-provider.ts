import { Optional, SkipSelf, Provider } from '@angular/core';
import { Http } from '@angular/http';

import { RestPythonService } from '../rest-python/rest-python.module';
import { DomainService }     from '../domain/domain.module';

import { WaveformService } from './waveform.service';

/**
 * This method instantiates a new instance for service if none is provided.
 * @internal
 * @param [service] An existing instance of the service 
 * @param http The HTTP service for server callbacks
 * @param restPython The REST Python service for URL serialization
 * @param domainService The Domain service that can contains this Waveform
 */
export function serviceSelect (
    service: WaveformService,
    http: Http,
    restPython: RestPythonService,
    domain: DomainService): WaveformService {
    if (service === null) {
        service = new WaveformService(http, restPython, domain);
    }
    return service;
}

/**
 * This is a default Service Provider factory that automatically selects the
 * "external" service (if already in the DI graph) or injects a new one using
 * the required set of external dependencies.
 */
export function waveformServiceProvider(): Provider[] {
    return [{
        provide:    WaveformService,
        useFactory: serviceSelect,
        deps: [
            [WaveformService, new Optional(), new SkipSelf()],
            Http,
            RestPythonService,
            DomainService
        ]
    }];
}
