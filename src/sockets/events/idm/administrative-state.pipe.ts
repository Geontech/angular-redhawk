import { Pipe, PipeTransform } from '@angular/core';

import { AdministrativeState } from '../../../models/index';

/**
 * Behaves like a toString() operator inside templates for the AdministrativeState
 * enumeration.
 */
@Pipe({name: 'administrativeState'})
export class AdministrativeStatePipe implements PipeTransform {
    transform(state: AdministrativeState): string {
        return AdministrativeState[state];
    }
}
