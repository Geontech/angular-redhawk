import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { DeviceModule } from '../device/device.module';
import { ComponentModule } from '../component/component.module';
import { WaveformModule } from '../waveform/waveform.module';

import { PortDirective } from './port.directive';

export { PortService }   from './port.service';
export { PortDirective } from './port.directive';
export * from './port';

@NgModule({
    imports:      [ HttpModule, DeviceModule, ComponentModule, WaveformModule ],
    exports:      [ PortDirective ],
    declarations: [ PortDirective ]
})
export class PortModule {}
