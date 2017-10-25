import { Pipe, PipeTransform } from '@angular/core';

import { ResourceRef, ResourceRefs } from '../models/index';

/**
 * Filter a ResourceRef listing using either id or name.
 */
export interface IRefFilter {
    id?:   string;
    name?: string;
}

/**
 * Returns a specific ResourceRef by its ID or Name out of a list matching first
 * the ID if provided, otherwise the name is used to match.
 */
@Pipe({name: 'arResourceRef'})
export class ResourceRefPipe implements PipeTransform {
    transform(refs: ResourceRefs, target: IRefFilter): ResourceRef {
        let ref = refs.filter(r => {
            if (target.id !== undefined) {
                return (r.id === target.id);
            } else if (target.name !== undefined) {
                return (r.name === target.name);
            }
            return false;
        });
        return ref[0] || undefined;
    }
}
