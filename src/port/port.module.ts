import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonModule } from '../rest-python/rest-python.module';
import { SocketsModule }    from '../sockets/sockets.module';
import { DeviceModule }     from '../device/device.module';
import { ComponentModule }  from '../component/component.module';
import { WaveformModule }   from '../waveform/waveform.module';

import { PortDirective }       from './port.directive';
export { PortDirective }       from './port.directive';
export *                       from './refs/index';
export { PortService }         from './port.service';
export { portServiceProvider } from './port-service-provider';

@NgModule({
    imports:      [
        HttpModule,
        RestPythonModule,
        DeviceModule,
        ComponentModule,
        WaveformModule,
        SocketsModule
    ],
    exports:      [ PortDirective ],
    declarations: [ PortDirective ]
})
export class PortModule {}
