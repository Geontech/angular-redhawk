import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonModule } from '../rest-python/rest-python.module';
import { WaveformModule } from '../waveform/waveform.module';

import { ComponentDirective } from './component.directive';

export { ComponentService }   from './component.service';
export { ComponentDirective } from './component.directive';
export * from './component';

@NgModule({
    imports:      [ HttpModule, WaveformModule, RestPythonModule.forChild() ],
    exports:      [ ComponentDirective ],
    declarations: [ ComponentDirective ]
})
export class ComponentModule {}
