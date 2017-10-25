import { ISerializableFn } from '../../serialization/index';

import { StateChangeCategory } from './enums/index';

import { IdmEvent } from './idm-event';

import { UsageStateEvent } from './usage-state-event';
import { AdministrativeStateEvent } from './administrative-state-event';
import { OperationalStateEvent } from './operational-state-event';
import { AbnormalComponentTerminationEvent } from './abnormal-component-termination-event';

// Deserialization function for all IdmEvent types
let deserializeIdmEvent: ISerializableFn<IdmEvent>;
deserializeIdmEvent = function (input: any): IdmEvent {
    let out: IdmEvent = null;
    if (input.hasOwnProperty('stateChangeCategory')) {
        let catStr = <string> input.stateChangeCategory.value;
        let category = fromString(catStr);

        switch (category) {
            case StateChangeCategory.ADMINISTRATIVE_STATE_EVENT:
                out = new AdministrativeStateEvent().deserialize(input);
                break;
            case StateChangeCategory.OPERATIONAL_STATE_EVENT:
                out = new OperationalStateEvent().deserialize(input);
                break;
            case StateChangeCategory.USAGE_STATE_EVENT:
                out = new UsageStateEvent().deserialize(input);
                break;
            default:
                console.error('Unknown StateChangeCategory: ' + catStr);
                break;
        }
    } else if (input.hasOwnProperty('applicationId')) {
        out = new AbnormalComponentTerminationEvent().deserialize(input);
    } else {
        console.error('Unknown IDM Event structure; unable to deserialize');
    }
    return out;
};

export { deserializeIdmEvent };

/**
 * Helper function for converting StateChangeCategory to the enumeration
 */
function fromString(category: string): StateChangeCategory {
    let out = StateChangeCategory.UNKNOWN;
    switch (category) {
        case 'ADMINISTRATIVE_STATE_EVENT':
            out = StateChangeCategory.ADMINISTRATIVE_STATE_EVENT;
            break;
        case 'OPERATIONAL_STATE_EVENT':
            out = StateChangeCategory.OPERATIONAL_STATE_EVENT;
            break;
        case 'USAGE_STATE_EVENT':
            out = StateChangeCategory.USAGE_STATE_EVENT;
            break;
        default:
            console.error('Unknown StateChangeCategory: ' + category);
            break;
    }
    return out;
}
