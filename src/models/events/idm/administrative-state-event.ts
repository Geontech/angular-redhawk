import { ISerializable }       from '../../serialization/index';

import { IdmEvent }            from './idm-event';
import { IdmStateEvent }       from './idm-state-event';
import { AdministrativeState } from './enums/index';

/**
 * Serializable REDHAWK IDM Administrative State Event
 */
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

/**
 * Internal helper function for converting to the enumeration value.
 */
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
