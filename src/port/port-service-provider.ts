import { Optional, SkipSelf, Provider } from '@angular/core';
import { Http } from '@angular/http';

import { RestPythonService } from '../rest-python/rest-python.module';
import { WaveformService }   from '../waveform/waveform.module';
import { DeviceService }     from '../device/device.module';
import { ComponentService }  from '../component/component.module';

import { PortService } from './port.service';

export function serviceSelect(
    service: PortService,
    http: Http,
    restPython: RestPythonService,
    waveform: WaveformService,
    device: DeviceService,
    component: ComponentService): PortService {
    if (service === null) {
        service = new PortService(http, restPython, waveform, device, component);
    }
    return service;
}

/**
 * This is a default Service Provider factory that automatically selects the
 * "external" service (if already in the DI graph) or injects a new one using
 * the required set of external dependencies.
 */
export function portServiceProvider(): Provider[] {
    return [{
        provide:    PortService,
        useFactory: serviceSelect,
        deps: [
            [PortService, new Optional(), new SkipSelf()],
            Http,
            RestPythonService,
            [WaveformService, new Optional()],
            [DeviceService, new Optional()],
            [ComponentService, new Optional()]
        ]
    }];
}
