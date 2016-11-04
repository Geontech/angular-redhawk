import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { DomainModule } from '../domain/domain.module';

export { FilesystemService } from './filesystem.service';
export * from './filesystem';

@NgModule({
    imports:      [ HttpModule, DomainModule ],
    exports:      [ ],
    declarations: [ ]
})
export class FilesystemModule {}
