import { ISerializableFn } from '../../shared/serializable';

import { IdmEvent } from './idm.event.base';
import { StateChangeCategory, fromString } from './idm.state.event';
import { UsageStateEvent } from './usage.state.event';
import { AdministrativeStateEvent } from './administrative.state.event';
import { OperationalStateEvent } from './operational.state.event';
import { AbnormalComponentTerminationEvent } from './abnormal.component.termination.event';

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
