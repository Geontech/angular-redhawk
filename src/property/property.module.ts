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

/**
 * The PropertyModule provides a number of pipes to facilitate in-template
 * sorting of Property types and subclasses.
 */
@NgModule({
    imports:      [ ],
    exports:      PIPES,
    declarations: PIPES
})
export class PropertyModule { /** */ }
