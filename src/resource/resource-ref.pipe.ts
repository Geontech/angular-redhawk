import { Pipe, PipeTransform } from '@angular/core';

import { ResourceRef, ResourceRefs } from '../models/index';

import { IRefFilter } from './ref-filter';

/**
 * Returns a specific ResourceRef by its ID or Name out of a list matching first
 * the ID if provided, otherwise the name is used to match.
 *
 * Supports Regular Expressions.
 *
 * You can specify the 'key' argument to return just the string member matching
 * that key (in this case, 'id' or 'name' would work).
 */
@Pipe({name: 'arResourceRef'})
export class ResourceRefPipe implements PipeTransform {
    transform(refs: ResourceRefs, target: IRefFilter, key?: string): ResourceRef | string {
        let id   = new RegExp(target.id || '.*');
        let name = new RegExp(target.name || '.*');
        let ref = refs.filter(r => { return (id.test(r.id) || name.test(r.name)); })[0] || undefined;
        if (ref !== undefined && key !== undefined) {
            return ref[key]; // Returns the key.
        }
        return ref;
    }
}
