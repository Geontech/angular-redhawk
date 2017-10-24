import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonModule } from '../rest-python/rest-python.module';
import { DeviceModule } from '../device/device.module';
import { ComponentModule } from '../component/component.module';
import { WaveformModule } from '../waveform/waveform.module';

import { PortDirective } from './port.directive';

export { PortService }   from './port.service';
export { PortDirective } from './port.directive';
export * from './port';
export * from './refs/refs.module';
export * from './enums/enums.module';

@NgModule({
    imports:      [
        HttpModule,
        DeviceModule,
        ComponentModule,
        WaveformModule,
        RestPythonModule.forChild()
    ],
    exports:      [ PortDirective ],
    declarations: [ PortDirective ]
})
export class PortModule {}
