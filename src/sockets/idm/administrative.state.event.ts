import { Pipe, PipeTransform } from '@angular/core';

import { ISerializable } from '../../shared/serializable';
import { IdmStateEvent } from './idm.state.event';

export enum AdministrativeState {
    LOCKED,
    UNLOCKED,
    SHUTTING_DOWN,
    UNKNOWN
}

export function resolve(category: string): AdministrativeState {
    switch (category) {
        case 'LOCKED':
            return AdministrativeState.LOCKED;
        case 'UNLOCKED':
            return AdministrativeState.UNLOCKED;
        case 'SHUTTING_DOWN':
            return AdministrativeState.SHUTTING_DOWN;
        default:
            console.error('Unknown AdministrativeState: ' + category);
            return AdministrativeState.UNKNOWN;
    }
}

export class AdministrativeStateEvent
    extends IdmStateEvent<AdministrativeState>
    implements ISerializable<AdministrativeStateEvent> {
    deserialize(input: any) {
        super.deserialize(input);
        this.stateChangeFrom = resolve(input.stateChangeFrom.value);
        this.stateChangeTo = resolve(input.stateChangeTo.value);
        return this;
    }
}

// Behaves like a toString() operator inside templates for the AdministrativeState
// enumeration.
@Pipe({name: 'administrativeState'})
export class AdministrativeStatePipe implements PipeTransform {
    transform(state: AdministrativeState): string {
        return AdministrativeState[state];
    }
}
