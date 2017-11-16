import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonModule } from '../rest-python/rest-python.module';
import { WaveformModule }   from '../waveform/waveform.module';

import { ComponentDirective } from './component.directive';

export { ComponentService }   from './component.service';
export { ComponentDirective } from './component.directive';
export { componentServiceProvider } from './component-service-provider';

/**
 * The ComponentModule includes a directive and service for interfacing with a
 * Component on the REST server.
 */
@NgModule({
    imports: [
        HttpModule,
        RestPythonModule,
        WaveformModule
        ],
    exports:      [ ComponentDirective ],
    declarations: [ ComponentDirective ]
})
export class ComponentModule {}
