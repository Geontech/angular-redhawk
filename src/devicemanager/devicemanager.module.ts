import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { DomainModule } from '../domain/domain.module';

import { ArDeviceManager } from './devicemanager.directive';

export { DeviceManagerService } from './devicemanager.service';
export { ArDeviceManager } from './devicemanager.directive';
export * from './devicemanager';

@NgModule({
    imports:      [ HttpModule, DomainModule ],
    exports:      [ ArDeviceManager ],
    declarations: [ ArDeviceManager ]
})
export class DeviceManagerModule {}
