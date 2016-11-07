import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { DomainModule } from '../domain/domain.module';

import { ArWaveform } from './waveform.directive';

export { WaveformService } from './waveform.service';
export { ArWaveform } from './waveform.directive';
export * from './waveform';

@NgModule({
    imports:      [ HttpModule, DomainModule ],
    exports:      [ ArWaveform ],
    declarations: [ ArWaveform ]
})
export class WaveformModule {}
