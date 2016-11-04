import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { WaveformModule } from '../waveform/waveform.module';

import { ArComponent } from './component.directive';

export { ComponentService } from './component.service';
export { ArComponent } from './component.directive';
export * from './component';

@NgModule({
    imports:      [ HttpModule, WaveformModule ],
    exports:      [ ArComponent ],
    declarations: [ ArComponent ]
})
export class ComponentModule {}
