import { Provider } from '@angular/core';
import { Http } from '@angular/http';

import { WaveformService } from '../../waveform/waveform.module';
import { DomainService } from '../../domain/domain.module';
import { RestPythonService } from '../../rest-python/rest-python.module';

/**
 * DeviceManager(Service) Factory returns a new instance of the
 * DeviceManagerService.
 * @param http The Http Service
 * @param restPython The RestPythonService
 * @param domain The DomainService
 */
export function waveformFactory(
  http: Http,
  restPython: RestPythonService,
  domain: DomainService
) {
  return new WaveformService(http, restPython, domain);
}

/**
 * Returns a provider for a waveform mapped to the token and domain
 * provider specified.
 * @param token InjectionToken, string or class to represent this instance
 * @param domain The parent Domain provider
 */
export function waveformProvider(token: any, domain: any): Provider {
  return {
    provide: token,
    useFactory: waveformFactory,
    deps: [ Http, RestPythonService, domain ]
  };
}
