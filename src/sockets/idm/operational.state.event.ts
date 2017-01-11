import { Pipe, PipeTransform } from '@angular/core';

import { ISerializable } from '../../shared/serializable';
import { IdmStateEvent } from './idm.state.event';

export enum OperationalState {
    ENABLED,
    DISABLED,
    UNKNOWN
}

export function resolve(category: string): OperationalState {
    switch (category) {
        case 'ENABLED':
            return OperationalState.ENABLED;
        case 'DISABLED':
            return OperationalState.DISABLED;
        default:
            console.error('Unknown OperationalState: ' + category);
            return OperationalState.UNKNOWN;
    }
}

export class OperationalStateEvent extends IdmStateEvent<OperationalState> implements ISerializable<OperationalStateEvent> {
    deserialize(input: any) {
        super.deserialize(input);
        this.stateChangeFrom = resolve(input.stateChangeFrom.value);
        this.stateChangeTo = resolve(input.stateChangeTo.value);
        return this;
    }
}

// Behaves like a toString() operator inside templates for the OperationalState
// enumeration.
@Pipe({name: 'operationalState'})
export class OperationalStatePipe implements PipeTransform {
    transform(state: OperationalState): string {
        return OperationalState[state];
    }
}
