import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonModule }    from '../rest-python/rest-python.module';
import { DeviceManagerModule } from '../devicemanager/device-manager.module';

import { DeviceDirective } from './device.directive';

export { DeviceService }         from './device.service';
export { DeviceDirective }       from './device.directive';
export { deviceServiceProvider } from './device-service-provider';

// Interfaces
export * from './device-property-command';
export * from './device-property-command-response';
export * from './device-property-command-type';

/**
 * The DeviceModule includes a directive and service for interfacing with a
 * Device on the REST server.
 */
@NgModule({
    imports: [
        HttpModule,
        RestPythonModule,
        DeviceManagerModule
        ],
    exports:      [ DeviceDirective ],
    declarations: [ DeviceDirective ]
})
export class DeviceModule {}
