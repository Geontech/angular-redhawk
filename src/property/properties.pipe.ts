import { Pipe, PipeTransform } from '@angular/core';

import { PropertySet } from './property';

/**
 * Returns a sub-list of properties from a list of properties using an array of IDs.
 */
@Pipe({name: 'arProperties'})
export class ArPropertiesPipe implements PipeTransform {
    transform(properties: PropertySet, ids: Array<string>): PropertySet {
        let set: PropertySet = [];
        properties.filter(prop => {
            for (let id in ids) {
                if (prop.id === id) {
                    set.push(prop);
                }
            }
        });
        return set;
    }
}
