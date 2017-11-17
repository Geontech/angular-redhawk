import { ISerializable } from '../../serialization/index';

import { IdmStateEvent } from './idm-state-event';
import { UsageState }    from './enums/index';

/**
 * Serializable REDHAWK IDM Usage State Event model
 */
export class UsageStateEvent
    extends IdmStateEvent<UsageState>
    implements ISerializable<UsageStateEvent> {

    /** Deserializes a JSON object into this class */
    deserialize(input: any) {
        super.deserialize(input);
        this.stateChangeFrom = fromString(input.stateChangeFrom.value);
        this.stateChangeTo = fromString(input.stateChangeTo.value);
        return this;
    }
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
