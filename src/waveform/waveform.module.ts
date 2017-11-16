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
export { waveformServiceProvider } from './waveform-service-provider';

/**
 * The WaveformModule includes a directive and service for interfacing with a
 * Waveform on the REST server.
 */
@NgModule({
    imports:      [
    HttpModule,
    RestPythonModule,
    DomainModule
    ],
    exports:      [ WaveformDirective ],
    declarations: [ WaveformDirective ]
})
export class WaveformModule {}
