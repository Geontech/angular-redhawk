import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonModule } from '../rest-python/rest-python.module';
import { DomainModule } from '../domain/domain.module';

export { FilesystemService } from './filesystem.service';
export * from './filesystem';

@NgModule({
    imports:      [ HttpModule, DomainModule, RestPythonModule.forChild() ],
    exports:      [ ],
    declarations: [ ]
})
export class FilesystemModule {}
