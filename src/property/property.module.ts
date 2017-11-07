import { NgModule } from '@angular/core';

export * from './properties.pipe';
export * from './property.pipe';
export * from './property-command';

// Pipes
import { PropertyPipe } from './property.pipe';
import { PropertiesPipe } from './properties.pipe';
import { PropretiesOfKindPipe } from './properties-of-kind.pipe';

const PIPES = [
    PropretiesOfKindPipe,
    PropertiesPipe,
    PropertyPipe
    ];

@NgModule({
    imports:      [ ],
    exports:      PIPES,
    declarations: PIPES
})
export class PropertyModule { /** */ }
