import { Pipe, PipeTransform } from '@angular/core';

import { SourceCategory } from '../../../models/index';
/**
 * Acts like 'toString' for the SourceCategory enumeration
 */
@Pipe({ name: 'arSourceCategory'})
export class SourceCategoryPipe implements PipeTransform {
    transform (category: SourceCategory): string {
        return SourceCategory[category];
    }
}
