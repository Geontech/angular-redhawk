import { NgModule } from '@angular/core';

import { JsonSocketService } from './json.socket.service';

export { OdmListenerService } from './odm.listener.service';

export { SourceCategory, OdmEvent } from './odm.event';

@NgModule({
    providers: [
        JsonSocketService
    ]
})
export class SocketsModule {}
