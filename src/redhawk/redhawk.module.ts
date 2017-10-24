import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonModule } from '../rest-python/rest-python.module';
import { RedhawkDirective } from './redhawk.directive';

export { RedhawkDirective } from './redhawk.directive';
export { RedhawkService }   from './redhawk.service';
export * from './redhawk';

@NgModule({
    imports:      [ HttpModule, RestPythonModule.forChild() ],
    exports:      [ RedhawkDirective ],
    declarations: [ RedhawkDirective ]
})
export class RedhawkModule { /** */ }
