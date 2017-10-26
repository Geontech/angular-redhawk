import { Optional, SkipSelf, Provider } from '@angular/core';
import { Http } from '@angular/http';

import { RestPythonService } from '../rest-python/rest-python.module';
import { WaveformService } from '../waveform/waveform.module';

import { ComponentService } from './component.service';

export function serviceSelect(
    service: ComponentService,
    http: Http,
    restPython: RestPythonService,
    waveform: WaveformService): ComponentService {
    if (service === null) {
        service = new ComponentService(http, restPython, waveform);
    }
    return service;
}

/**
 * This is a default Service Provider factory that automatically selects the
 * "external" service (if already in the DI graph) or injects a new one using
 * the required set of external dependencies.
 */
export function componentServiceProvider(): Provider[] {
    return [{
        provide:    ComponentService,
        useFactory: serviceSelect,
        deps: [
            [ComponentService, new Optional(), new SkipSelf()],
            Http,
            RestPythonService,
            WaveformService
        ]
    }];
}
