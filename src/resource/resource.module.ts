import { NgModule } from '@angular/core';

import { ResourceRefPipe } from './resource-ref.pipe';
import { ResourceRefsPipe } from './resource-refs.pipe';

export * from './ref-filter';
export * from './resource-ref.pipe';
export * from './resource-refs.pipe';

@NgModule({
    exports:      [ ResourceRefPipe, ResourceRefsPipe ],
    declarations: [ ResourceRefPipe, ResourceRefsPipe ]
})
export class ResourceModule {}
