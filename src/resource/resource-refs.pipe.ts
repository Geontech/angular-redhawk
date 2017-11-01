import { Pipe, PipeTransform } from '@angular/core';

import { ResourceRefs } from '../models/index';

import { IRefFilter } from './ref-filter';

/**
 * Returns a list (ResourceRefs) that match either the ID or the Name specified
 * in the filter.
 *
 * Supports Regular Expressions.
 */
@Pipe({name: 'arResourceRefs'})
export class ResourceRefsPipe implements PipeTransform {
    transform(refs: ResourceRefs, target: IRefFilter): ResourceRefs {
        let id   = new RegExp(target.id || '.*');
        let name = new RegExp(target.name || '.*');
        return refs.filter(r => {
            return (id.test(r.id) || name.test(r.name));
        });
    }
}
