import { NgModule } from '@angular/core';

import { JsonSocketService } from './json.socket.service';

export { EventChannelService } from './event.channel.service';
export { OdmListenerService } from './odm/odm.listener.service';
export { IdmListenerService } from './idm/idm.listener.service';

export { RhMessage } from './message/message';
export * from './odm/odm.listener.service';
export * from './idm/idm.listener.service';

@NgModule({
    providers: [
        JsonSocketService
    ]
})
export class SocketsModule {}
