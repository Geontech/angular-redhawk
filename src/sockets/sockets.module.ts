import { NgModule } from '@angular/core';

// BULKIO service and data types
export { BulkioListenerService }from './bulkio/bulkio.listener.service';
export { BulkioPacket } from './bulkio/bulkio.packet';
export { SRI } from './bulkio/sri';
export { PrecisionUTCTime } from './bulkio/precision.utc.time';


// Event and derived services and types
export { EventChannelService } from './event.channel.service';
export { OdmListenerService } from './odm/odm.listener.service';
export { IdmListenerService } from './idm/idm.listener.service';
export { OdmEvent, SourceCategory }from './odm/odm.event';
export * from './idm/idm.event';
export * from './message/message';

@NgModule({/** INTENTIONALLY EMPTY */})
export class SocketsModule {}
