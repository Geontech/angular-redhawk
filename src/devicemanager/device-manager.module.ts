import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonModule } from '../rest-python/rest-python.module';
import { DomainModule }     from '../domain/domain.module';

import { DeviceManagerDirective } from './device-manager.directive';

export { DeviceManagerService }         from './device-manager.service';
export { DeviceManagerDirective }       from './device-manager.directive';
export { deviceManagerServiceProvider } from './device-manager-service-provider';

/**
 * The DeviceManagerModule includes a directive and service for interfacing with a
 * DeviceManager on the REST server.
 */
@NgModule({
    imports:      [
        HttpModule,
        RestPythonModule,
        DomainModule
    ],
    exports:      [ DeviceManagerDirective ],
    declarations: [ DeviceManagerDirective ]
})
export class DeviceManagerModule {}
