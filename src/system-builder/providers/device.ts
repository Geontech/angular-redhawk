import { Provider } from '@angular/core';
import { Http } from '@angular/http';

import { DeviceManagerService } from '../../devicemanager/device-manager.module';
import { DeviceService } from '../../device/device.module';
import { RestPythonService } from '../../rest-python/rest-python.module';

/**
 * Device(Service) Factory returns a new instance of the DeviceService.
 * @param http The Http Service
 * @param restPython The RestPythonService
 * @param deviceManagerService The DeviceManagerService
 */
export function deviceFactory(
  http: Http,
  restPython: RestPythonService,
  deviceManager: DeviceManagerService
) {
  return new DeviceService(http, restPython, deviceManager);
}

/**
 * Returns a provider for a device mapped to the token and device manager
 * provider specified.
 * @param token InjectionToken, string or class to represent this instance
 * @param deviceManager The parent DeviceManager provider
 */
export function deviceProvider(token: any, deviceManager: any): Provider {
  return {
    provide: token,
    useFactory: deviceFactory,
    deps: [ Http, RestPythonService, deviceManager ]
  };
}
