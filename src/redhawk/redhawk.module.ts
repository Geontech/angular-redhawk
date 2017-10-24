import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonModule } from '../rest-python/rest-python.module';
import { SocketsModule }    from '../sockets/sockets.module';

import { RedhawkDirective } from './redhawk.directive';

export { RedhawkDirective } from './redhawk.directive';
export { RedhawkService }   from './redhawk.service';

@NgModule({
    imports:      [
        HttpModule,
        RestPythonModule.forChild(),
        SocketsModule
        ],
    exports:      [ RedhawkDirective ],
    declarations: [ RedhawkDirective ]
})
export class RedhawkModule { /** */ }
