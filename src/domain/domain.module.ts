import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonModule } from '../rest-python/rest-python.module';
import { RedhawkModule } from '../redhawk/redhawk.module';
import { SocketsModule } from '../sockets/sockets.module';

import { DomainDirective } from './domain.directive';

export { DomainService }   from './domain.service';
export { DomainDirective } from './domain.directive';
export * from './domain';

@NgModule({
    imports:      [
        HttpModule,
        RedhawkModule,
        SocketsModule,
        RestPythonModule.forChild()
        ],
    exports:      [ DomainDirective ],
    declarations: [ DomainDirective ]
})
export class DomainModule {}
