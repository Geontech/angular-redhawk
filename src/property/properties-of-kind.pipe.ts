import { Pipe, PipeTransform } from '@angular/core';

import { PropertySet } from '../models/index';

/**
 * Returns a sub-list of properties from a list of properties that match the 
 * specified kind.  The default kind is 'property'.
 */
@Pipe({name: 'arPropretiesOfKind'})
export class PropretiesOfKindPipe implements PipeTransform {
    transform(properties: PropertySet, kind = 'property'): PropertySet {
        let set: PropertySet = [];
        properties.filter(prop => {
            if (prop.kinds instanceof Array) {
                const kinds: Array<string> = prop.kinds;
                if (kinds.indexOf(kind) > -1) {
                    set.push(prop);
                }
            } else if (kind === prop.kinds) {
                set.push(prop);
            }
        });
        return set;
    }
}
