import { NgModule } from '@angular/core';

// Service interface to REST-Python
import { RestPythonModule } from '../rest-python/rest-python.module';

import { EventChannelModule } from './events/event-channel.module';
export * from './events/event-channel.module';

export * from './bulkio/index';
export * from './redhawk-listener.service';

/**
 * The SocketsModule provides access to other modules involving websockets 
 * including the event services and BULKIO data transfers.
 */
@NgModule({
    imports: [
        RestPythonModule.forChild(),
        EventChannelModule
    ],
    exports: [
        EventChannelModule,
    ]
})
export class SocketsModule {}
