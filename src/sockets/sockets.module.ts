import { NgModule } from '@angular/core';

// General socket
export { basicSocket, WebSocketBinaryType } from './basic.socket';

// BULKIO service and data types
export { BulkioListenerService }from './bulkio/bulkio.listener.service';
export { BulkioPacket } from './bulkio/bulkio.packet';
export { SRI } from './bulkio/sri';
export { PrecisionUTCTime } from './bulkio/precision.utc.time';

// Event and derived services and types
export { EventChannelService } from './event.channel.service';
export * from './odm/odm.listener.service';
export * from './idm/idm.listener.service';
export * from './redhawk.listener.service';
export * from './odm/odm.event';
export * from './idm/idm.event';
export { RhMessage, isRhMessage } from './message/message';

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
