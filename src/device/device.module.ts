import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { DeviceManagerModule } from '../devicemanager/devicemanager.module';

import { ArDevice } from './device.directive';

export { DeviceService } from './device.service';
export { ArDevice } from './device.directive';
export * from './device';

@NgModule({
    imports:      [ HttpModule, DeviceManagerModule ],
    exports:      [ ArDevice ],
    declarations: [ ArDevice ]
})
export class DeviceModule {}
