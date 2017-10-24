import { Pipe, PipeTransform } from '@angular/core';

import { OperationalState } from '../../../models/index';

/**
 * Behaves like a toString() operator inside templates for the OperationalState
 * enumeration
 */
@Pipe({name: 'operationalState'})
export class OperationalStatePipe implements PipeTransform {
    transform(state: OperationalState): string {
        return OperationalState[state];
    }
}
