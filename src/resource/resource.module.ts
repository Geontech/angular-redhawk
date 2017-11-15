import { NgModule } from '@angular/core';

import { ResourceRefPipe } from './resource-ref.pipe';
import { ResourceRefsPipe } from './resource-refs.pipe';

export * from './ref-filter';
export * from './resource-ref.pipe';
export * from './resource-refs.pipe';

/**
 * ResourceModule provides convenience pipes for filtering lists of
 * resource references (i.e., { id: 'something', name: 'something_else'})
 */
@NgModule({
    exports:      [ ResourceRefPipe, ResourceRefsPipe ],
    declarations: [ ResourceRefPipe, ResourceRefsPipe ]
})
export class ResourceModule {}
