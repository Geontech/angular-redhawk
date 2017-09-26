import { Pipe, PipeTransform } from '@angular/core';

import { IdmEvent }      from './idm.event.base';
import { ISerializable } from '../../shared/serializable';
import { IdmStateEvent } from './idm.state.event';

export enum OperationalState {
    ENABLED,
    DISABLED,
    UNKNOWN
}

function fromString(category: string): OperationalState {
    let out = OperationalState.UNKNOWN;
    switch (category) {
        case 'ENABLED':
            out = OperationalState.ENABLED;
            break;
        case 'DISABLED':
            out = OperationalState.DISABLED;
            break;
        default:
            console.error('Unknown OperationalState: ' + category);
            break;
    }
    return out;
}

export class OperationalStateEvent 
    extends IdmStateEvent<OperationalState> 
    implements ISerializable<OperationalStateEvent> {
    deserialize(input: any) {
        super.deserialize(input);
        this.stateChangeFrom = fromString(input.stateChangeFrom.value);
        this.stateChangeTo = fromString(input.stateChangeTo.value);
        return this;
    }
}

export function isOperationalStateEvent(event: IdmEvent): event is OperationalStateEvent {
    return event instanceof OperationalStateEvent;
}

// Behaves like a toString() operator inside templates for the OperationalState
// enumeration.
@Pipe({name: 'operationalState'})
export class OperationalStatePipe implements PipeTransform {
    transform(state: OperationalState): string {
        return OperationalState[state];
    }
}
