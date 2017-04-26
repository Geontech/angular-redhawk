import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { DomainModule } from '../domain/domain.module';

import { WaveformDirective } from './waveform.directive';

export { WaveformService }   from './waveform.service';
export { WaveformDirective } from './waveform.directive';
export * from './waveform';

@NgModule({
    imports:      [ HttpModule, DomainModule ],
    exports:      [ WaveformDirective ],
    declarations: [ WaveformDirective ]
})
export class WaveformModule {}
