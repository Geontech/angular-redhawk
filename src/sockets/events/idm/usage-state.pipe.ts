import { Pipe, PipeTransform } from '@angular/core';

import { UsageState } from '../../../models/index';

// Behaves like a toString() operator inside templates for the UsageState
// enumeration.
@Pipe({name: 'usageState'})
export class UsageStatePipe implements PipeTransform {
    transform(state: UsageState): string {
        return UsageState[state];
    }
}
