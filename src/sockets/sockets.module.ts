import { NgModule } from '@angular/core';

export { basicSocket, WebSocketBinaryType } from './basic.socket';
export { EventChannelService } from './event.channel.service';
export * from './odm/odm.listener.service';
export * from './idm/idm.listener.service';

export * from './odm/odm.event';
export * from './idm/idm.event';

export { RhMessage } from './message/message';

// Pipes for enumerations
import {
    AdministrativeStatePipe,
    OperationalStatePipe,
    UsageStatePipe
} from './idm/idm.event.pipes';

import {
    SourceCategoryPipe,
    ResourceStateChangePipe
} from './odm/odm.event.pipes';

@NgModule({
    exports: [
        // IDM
        AdministrativeStatePipe,
        OperationalStatePipe,
        UsageStatePipe,
        // ODM
        SourceCategoryPipe,
        ResourceStateChangePipe
    ],
    declarations: [
        // IDM
        AdministrativeStatePipe,
        OperationalStatePipe,
        UsageStatePipe,
        // ODM
        SourceCategoryPipe,
        ResourceStateChangePipe
    ]
})
export class SocketsModule {}
