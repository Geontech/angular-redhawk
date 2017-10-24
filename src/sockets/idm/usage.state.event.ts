import { Pipe, PipeTransform } from '@angular/core';

import { IdmEvent }      from './idm.event.base';
import { ISerializable } from '../../base/serializable';
import { IdmStateEvent } from './idm.state.event';

export enum UsageState {
    IDLE,
    ACTIVE,
    BUSY,
    UNKNOWN
}


function fromString(category: string): UsageState {
    let out = UsageState.UNKNOWN;
    switch (category) {
        case 'IDLE':
            out = UsageState.IDLE;
            break;
        case 'ACTIVE':
            out = UsageState.ACTIVE;
            break;
        case 'BUSY':
            out = UsageState.BUSY;
            break;
        default:
            console.error('Unknown UsageState: ' + category);
            break;
    }
    return out;
}

export class UsageStateEvent
    extends IdmStateEvent<UsageState>
    implements ISerializable<UsageStateEvent> {
    deserialize(input: any) {
        super.deserialize(input);
        this.stateChangeFrom = fromString(input.stateChangeFrom.value);
        this.stateChangeTo = fromString(input.stateChangeTo.value);
        return this;
    }
}

export function isUsageStateEvent(event: IdmEvent): event is UsageStateEvent {
    return event instanceof UsageStateEvent;
}

// Behaves like a toString() operator inside templates for the UsageState
// enumeration.
@Pipe({name: 'usageState'})
export class UsageStatePipe implements PipeTransform {
    transform(state: UsageState): string {
        return UsageState[state];
    }
}
