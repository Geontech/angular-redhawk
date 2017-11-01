import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonModule } from '../rest-python/rest-python.module';
import { DomainModule } from '../domain/domain.module';

export { FileSystemService }         from './file-system.service';
export { fileSystemServiceProvider } from './file-system-service-provider';

@NgModule({
    imports:      [
        HttpModule,
        RestPythonModule,
        DomainModule
        ],
    exports:      [ ],
    declarations: [ ]
})
export class FileSystemModule {}
