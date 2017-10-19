import { NgModule } from '@angular/core';

export * from './properties.pipe';
export * from './property.pipe';
export * from './property';

// Pipes
import { ArPropertyPipe } from './property/property.pipe';
import { ArPropertiesPipe } from './roperty/properties.pipe';

const PIPES = [ ArPropertiesPipe, ArPropertyPipe ];

@NgModule({
    imports:      [ ],
    exports:      PIPES,
    declarations: PIPES
})
export class PropertyModule { /** */ }
