import { ISerializable } from '../../serialization/index';

import { IdmEvent }      from './idm-event';
import { IdmStateEvent } from './idm-state-event';
import { OperationalState } from './enums/index';

/**
 * Serializable REDHAWK IDM Operational State Event model
 */
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