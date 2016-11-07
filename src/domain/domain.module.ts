import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RedhawkModule } from '../redhawk/redhawk.module';

import { ArDomain } from './domain.directive';

export { DomainService } from './domain.service';
export { ArDomain } from './domain.directive';
export * from './domain';

@NgModule({
    imports:      [ HttpModule, RedhawkModule ],
    exports:      [ ArDomain ],
    declarations: [ ArDomain ]
})
export class DomainModule {}
