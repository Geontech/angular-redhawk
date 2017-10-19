import { NgModule } from '@angular/core';

export * from './properties.pipe';
export * from './property.pipe';
export * from './property';

// Pipes
import { ArPropertyPipe } from './property.pipe';
import { ArPropertiesPipe } from './properties.pipe';

const PIPES = [ ArPropertiesPipe, ArPropertyPipe ];

@NgModule({
    imports:      [ ],
    exports:      PIPES,
    declarations: PIPES
})
export class PropertyModule { /** */ }
