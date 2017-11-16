import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonModule } from '../rest-python/rest-python.module';
import { DomainModule } from '../domain/domain.module';

export { FileSystemService }         from './file-system.service';
export { fileSystemServiceProvider } from './file-system-service-provider';

/**
 * The FileSystemModule includes a directive and service for interfacing with a
 * FileSystem on the REST server.
 */
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
