import { Pipe, PipeTransform } from '@angular/core';

import { IdmEvent }      from './idm.event.base';
import { ISerializable } from '../../base/serializable';
import { IdmStateEvent } from './idm.state.event';

export enum AdministrativeState {
    LOCKED,
    UNLOCKED,
    SHUTTING_DOWN,
    UNKNOWN
}

function fromString(category: string): AdministrativeState {
    let out = AdministrativeState.UNKNOWN;
    switch (category) {
        case 'LOCKED':
            out = AdministrativeState.LOCKED;
            break;
        case 'UNLOCKED':
            out = AdministrativeState.UNLOCKED;
            break;
        case 'SHUTTING_DOWN':
            out = AdministrativeState.SHUTTING_DOWN;
            break;
        default:
            console.error('Unknown AdministrativeState: ' + category);
            break;
    }
    return out;
}

export class AdministrativeStateEvent
    extends IdmStateEvent<AdministrativeState>
    implements ISerializable<AdministrativeStateEvent> {
    deserialize(input: any) {
        super.deserialize(input);
        this.stateChangeFrom = fromString(input.stateChangeFrom.value);
        this.stateChangeTo = fromString(input.stateChangeTo.value);
        return this;
    }
}

export function isAdministrativeStateEvent(event: IdmEvent): event is AdministrativeStateEvent {
    return event instanceof AdministrativeStateEvent;
}

// Behaves like a toString() operator inside templates for the AdministrativeState
// enumeration.
@Pipe({name: 'administrativeState'})
export class AdministrativeStatePipe implements PipeTransform {
    transform(state: AdministrativeState): string {
        return AdministrativeState[state];
    }
}
