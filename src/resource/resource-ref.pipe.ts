import { Pipe, PipeTransform } from '@angular/core';

import { ResourceRef, ResourceRefs } from '../models/index';

import { IRefFilter } from './ref-filter';

/**
 * Returns a specific ResourceRef by its ID or Name out of a list matching first
 * the ID if provided, otherwise the name is used to match.
 */
@Pipe({name: 'arResourceRef'})
export class ResourceRefPipe implements PipeTransform {
    transform(refs: ResourceRefs, target: IRefFilter): ResourceRef {
        return refs.filter(r => {
            return ((target.id !== undefined) && (r.id === target.id)) ||
                ((target.name !== undefined) && (r.name === target.name));
        })[0] || undefined;
    }
}
