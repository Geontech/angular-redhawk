import { ISerializableFn } from '../../shared/serializable';

import { UsageStateEvent } from './usage.state.event';
import { AdministrativeStateEvent } from './administrative.state.event';
import { OperationalStateEvent } from './operational.state.event';
import { AbnormalComponentTerminationEvent } from './abnormal.component.termination.event';

export type IdmEvent =
    UsageStateEvent |
    AdministrativeStateEvent |
    OperationalStateEvent |
    AbnormalComponentTerminationEvent;

export { UsageStateEvent, UsageState } from './usage.state.event';
export { AdministrativeStateEvent, AdministrativeState } from './administrative.state.event';
export { OperationalStateEvent, OperationalState } from './operational.state.event';
export { AbnormalComponentTerminationEvent } from './abnormal.component.termination.event';

let deserializeIdmEvent: ISerializableFn<IdmEvent>;
deserializeIdmEvent = function (input: any) {
    if (input.hasOwnProperty('stateChangeCategory')) {
        switch (<string> input.stateChangeCategory.value) {
            case 'ADMINISTRATIVE_STATE_EVENT':
                return new AdministrativeStateEvent().deserialize(input);
            case 'OPERATIONAL_STATE_EVENT':
                return new OperationalStateEvent().deserialize(input);
            case 'USAGE_STATE_EVENT':
                return new UsageStateEvent().deserialize(input);
            default:
                console.error('Unknown StateChangeCategory: ' + input.stateChangeCategory.value);
                return null;
        }
    } else if (input.hasOwnProperty('applicationId')) {
        return new AbnormalComponentTerminationEvent().deserialize(input);
    } else {
        console.error('Unknown IDM Event structure; unable to deserialize');
        return null;
    }

};

export { deserializeIdmEvent };
