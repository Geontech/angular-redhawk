import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { DeviceManagerModule } from '../devicemanager/devicemanager.module';

import { DeviceDirective } from './device.directive';

export { DeviceService }   from './device.service';
export { DeviceDirective } from './device.directive';
export * from './device';

@NgModule({
    imports:      [ HttpModule, DeviceManagerModule ],
    exports:      [ DeviceDirective ],
    declarations: [ DeviceDirective ]
})
export class DeviceModule {}
