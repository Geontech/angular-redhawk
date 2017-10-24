import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonModule } from '../rest-python/rest-python.module';
import { DomainModule }     from '../domain/domain.module';

import { WaveformDirective } from './waveform.directive';

export { WaveformService }   from './waveform.service';
export { WaveformDirective } from './waveform.directive';
export * from './waveform-control-command-response';
export * from './waveform-control-command';
export * from './waveform-launch-command-response';
export * from './waveform-launch-command';
export * from './waveform-release-response';

@NgModule({
    imports:      [
    HttpModule,
    RestPythonModule.forChild(),
    DomainModule
    ],
    exports:      [ WaveformDirective ],
    declarations: [ WaveformDirective ]
})
export class WaveformModule {}
