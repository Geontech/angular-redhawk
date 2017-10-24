import { NgModule } from '@angular/core';

import { AdministrativeStatePipe } from './administrative-state.pipe';
import { OperationalStatePipe } from './operational-state.pipe';
import { UsageStatePipe } from './usage-state.pipe';

export {
    IdmListenerService,
    idmListenerServiceProvider
} from './idm-listener.service';

// All pipes defined in this module
const PIPES = [
    AdministrativeStatePipe,
    OperationalStatePipe,
    UsageStatePipe
];

@NgModule({
    exports:      PIPES,
    declarations: PIPES
})
export class IdmEventModule {}
