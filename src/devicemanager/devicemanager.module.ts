import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonModule } from '../rest-python/rest-python.module';
import { DomainModule } from '../domain/domain.module';

import { DeviceManagerDirective } from './devicemanager.directive';

export { DeviceManagerService }   from './devicemanager.service';
export { DeviceManagerDirective } from './devicemanager.directive';
export * from './devicemanager';

@NgModule({
    imports:      [ HttpModule, DomainModule, RestPythonModule.forChild() ],
    exports:      [ DeviceManagerDirective ],
    declarations: [ DeviceManagerDirective ]
})
export class DeviceManagerModule {}
