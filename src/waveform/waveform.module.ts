import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonModule } from '../rest-python/rest-python.module';
import { DomainModule } from '../domain/domain.module';

import { WaveformDirective } from './waveform.directive';

export { WaveformService }   from './waveform.service';
export { WaveformDirective } from './waveform.directive';
export * from './waveform';

@NgModule({
    imports:      [ HttpModule, DomainModule, RestPythonModule.forChild() ],
    exports:      [ WaveformDirective ],
    declarations: [ WaveformDirective ]
})
export class WaveformModule {}
