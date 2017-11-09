import { Provider } from '@angular/core';
import { Http } from '@angular/http';

import { DeviceManagerService } from '../../devicemanager/device-manager.module';
import { DomainService } from '../../domain/domain.module';
import { RestPythonService } from '../../rest-python/rest-python.module';

/**
 * DeviceManager(Service) Factory returns a new instance of the
 * DeviceManagerService.
 * @param http The Http Service
 * @param restPython The RestPythonService
 * @param domain The DomainService
 */
export function deviceManagerFactory(
  http: Http,
  restPython: RestPythonService,
  domain: DomainService
) {
  return new DeviceManagerService(http, restPython, domain);
}

/**
 * Returns a provider for a device manager mapped to the token and domain
 * provider specified.
 * @param token InjectionToken, string or class to represent this instance
 * @param domain The parent Domain provider
 */
export function deviceManagerProvider(token: any, domain: any): Provider {
  return {
    provide: token,
    useFactory: deviceManagerFactory,
    deps: [ Http, RestPythonService, domain ]
  };
}
