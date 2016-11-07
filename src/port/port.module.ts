import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { DeviceModule } from '../device/device.module';
import { ComponentModule } from '../component/component.module';
import { WaveformModule } from '../waveform/waveform.module';

import { ArPort } from './port.directive';

export { PortService } from './port.service';
export { ArPort } from './port.directive';
export * from './port';

@NgModule({
    imports:      [ HttpModule, DeviceModule, ComponentModule, WaveformModule ],
    exports:      [ ArPort ],
    declarations: [ ArPort ]
})
export class PortModule {}
