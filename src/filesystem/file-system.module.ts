import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonModule } from '../rest-python/rest-python.module';
import { DomainModule } from '../domain/domain.module';

export { FileSystemService } from './file-system.service';

@NgModule({
    imports:      [
        HttpModule,
        RestPythonModule.forChild(),
        DomainModule
        ],
    exports:      [ ],
    declarations: [ ]
})
export class FileSystemModule {}
