import { NgModule } from '@angular/core';

// Angular REDHAWK back-end
import { ArSupportModule } from './support/ar.support';

// Angular REDHAWK client UI kit
import { ArUIKitModule } from './uikit/ar.uikit';

@NgModule({
    imports:      [
        ],

    exports:      [
        ArSupportModule,
        ArUIKitModule
    ],
    declarations: [
    ],
    providers:    [ ]
})
export class AngularRedhawk { }
