import { Optional, SkipSelf, Provider } from '@angular/core';
import { Http } from '@angular/http';

import { RestPythonService } from '../rest-python/rest-python.module';
import { DomainService }     from '../domain/domain.module';

import { WaveformService } from './waveform.service';

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
