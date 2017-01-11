import { Pipe, PipeTransform } from '@angular/core';

import { ISerializable } from '../../shared/serializable';
import { IdmStateEvent } from './idm.state.event';

export enum UsageState {
    IDLE,
    ACTIVE,
    BUSY,
    UNKNOWN
}

export function resolve(category: string): UsageState {
    switch (category) {
        case 'IDLE':
            return UsageState.IDLE;
        case 'ACTIVE':
            return UsageState.ACTIVE;
        case 'BUSY':
            return UsageState.BUSY;
        default:
            console.error('Unknown UsageState: ' + category);
            return UsageState.UNKNOWN;
    }
}

export class UsageStateEvent extends IdmStateEvent<UsageState> implements ISerializable<UsageStateEvent> {
    deserialize(input: any) {
        super.deserialize(input);
        this.stateChangeFrom = resolve(input.stateChangeFrom.value);
        this.stateChangeTo = resolve(input.stateChangeTo.value);
        return this;
    }
}

// Behaves like a toString() operator inside templates for the UsageState
// enumeration.
@Pipe({name: 'usageState'})
export class UsageStatePipe implements PipeTransform {
    transform(state: UsageState): string {
        return UsageState[state];
    }
}
