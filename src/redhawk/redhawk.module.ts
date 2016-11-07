import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { ArRedhawk } from './redhawk.directive';
import { RedhawkService } from './redhawk.service';

export { ArRedhawk } from './redhawk.directive';
export { RedhawkService } from './redhawk.service';
export * from './redhawk';

@NgModule({
    imports:      [ HttpModule ],
    exports:      [ ArRedhawk ],
    declarations: [ ArRedhawk ],
    providers:    [ RedhawkService ]
})
export class RedhawkModule { /** */ }
