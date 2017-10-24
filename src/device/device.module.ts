import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonModule } from '../rest-python/rest-python.module';
import { DeviceManagerModule } from '../devicemanager/devicemanager.module';

import { DeviceDirective } from './device.directive';

export { DeviceService }   from './device.service';
export { DeviceDirective } from './device.directive';
export * from './device';

@NgModule({
    imports:      [ HttpModule, DeviceManagerModule, RestPythonModule.forChild() ],
    exports:      [ DeviceDirective ],
    declarations: [ DeviceDirective ]
})
export class DeviceModule {}
