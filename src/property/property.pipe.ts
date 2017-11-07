import { Pipe, PipeTransform } from '@angular/core';

import { Property, PropertySet } from '../models/index';

/**
 * Returns a specific property by its ID out of a list.
 */
@Pipe({name: 'arProperty'})
export class PropertyPipe implements PipeTransform {
    transform(properties: PropertySet, id: string): Property {
        let p = properties.filter(prop => prop.id === id)[0] || undefined;
        return p;
    }
}
