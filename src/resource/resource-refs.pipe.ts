import { Pipe, PipeTransform } from '@angular/core';

import { ResourceRefs } from '../models/index';

import { IRefFilter } from './ref-filter';

/**
 * Returns a list (ResourceRefs) that match either the ID or the Name specified
 * in the filter.
 */
@Pipe({name: 'arResourceRefs'})
export class ResourceRefsPipe implements PipeTransform {
    transform(refs: ResourceRefs, target: IRefFilter): ResourceRefs {
        return refs.filter(r => {
            return ((target.id !== undefined) && (r.id === target.id)) ||
                ((target.name !== undefined) && (r.name === target.name));
        });
    }
}
