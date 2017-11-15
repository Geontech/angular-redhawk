import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonModule } from '../rest-python/rest-python.module';
import { SocketsModule }    from '../sockets/sockets.module';

import { RedhawkDirective } from './redhawk.directive';

export { RedhawkDirective }       from './redhawk.directive';
export { RedhawkService }         from './redhawk.service';
export { redhawkServiceProvider } from './redhawk-service-provider';

/**
 * The RedhawkModule includes a directive and service for interfacing the
 * REDHAWK System (in the general sense).
 */
@NgModule({
    imports:      [
        HttpModule,
        RestPythonModule,
        SocketsModule
        ],
    exports:      [ RedhawkDirective ],
    declarations: [ RedhawkDirective ]
})
export class RedhawkModule { /** */ }
