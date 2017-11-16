import { Provider } from '@angular/core';
import { Http } from '@angular/http';

import { WaveformService } from '../../waveform/waveform.module';
import { ComponentService } from '../../component/component.module';
import { RestPythonService } from '../../rest-python/rest-python.module';

/**
 * Component(Service) Factory returns a new instance of the ComponentService.
 * @param http The Http Service
 * @param restPython The RestPythonService
 * @param waveformService The WaveformService for this component
 */
export function deviceFactory(
  http: Http,
  restPython: RestPythonService,
  waveform: WaveformService
) {
  return new ComponentService(http, restPython, waveform);
}

/**
 * Returns a provider for a component mapped to the token and waveform
 * provider specified.
 * @param token InjectionToken, string or class to represent this instance
 * @param waveform The parent Waveform provider
 */
export function componentProvider(token: any, waveform: any): Provider {
  return {
    provide: token,
    useFactory: deviceFactory,
    deps: [ Http, RestPythonService, waveform ]
  };
}
