import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonModule } from '../rest-python/rest-python.module';
import { RedhawkModule }    from '../redhawk/redhawk.module';
import { SocketsModule }    from '../sockets/sockets.module';

import { DomainDirective } from './domain.directive';

export { DomainService }         from './domain.service';
export { DomainDirective }       from './domain.directive';
export { domainServiceProvider } from './domain-service-provider';

/**
 * The DomainModule includes a directive and service for interfacing with a
 * Domain on the REST server.
 */
@NgModule({
    imports:      [
        HttpModule,
        RestPythonModule,
        RedhawkModule,
        SocketsModule
        ],
    exports:      [ DomainDirective ],
    declarations: [ DomainDirective ]
})
export class DomainModule {}
