import { NgModule } from '@angular/core';

import { ResourceStateChangePipe } from './resource-state-change.pipe'
import { SourceCategoryPipe } from './source-category.pipe';

export {
    OdmListenerService,
    odmListenerServiceProvider
} from './odm-listener.service';

const PIPES = [
    ResourceStateChangePipe,
    SourceCategoryPipe
];

/**
 * REDHAWK ODM Event Module
 */
@NgModule({
    exports:      PIPES,
    declarations: PIPES
})
export class OdmEventModule {}
