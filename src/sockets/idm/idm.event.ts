import { ISerializableFn } from '../../shared/serializable';

import { UsageStateEvent } from './usage.state.event';
import { AdministrativeStateEvent } from './administrative.state.event';
import { OperationalStateEvent } from './operational.state.event';
export type IdmEvent = UsageStateEvent | AdministrativeStateEvent | OperationalStateEvent;

export { UsageStateEvent, UsageState } from './usage.state.event';
export { AdministrativeStateEvent, AdministrativeState } from './administrative.state.event';
export { OperationalStateEvent, OperationalState } from './operational.state.event';

type TStateChangeCategory =
    'ADMINISTRATIVE_STATE_EVENT' |
    'OPERATIONAL_STATE_EVENT' |
    'USAGE_STATE_EVENT';

let deserializeIdmEvent: ISerializableFn<IdmEvent>;
deserializeIdmEvent = function (input: any) {
    switch (<TStateChangeCategory> input.stateChangeCategory.value) {
        case 'ADMINISTRATIVE_STATE_EVENT':
            return new AdministrativeStateEvent().deserialize(input);
        case 'OPERATIONAL_STATE_EVENT':
            return new OperationalStateEvent().deserialize(input);
        case 'USAGE_STATE_EVENT':
        // tslint:disable-next-line:no-switch-case-fall-through
        default:
            return new UsageStateEvent().deserialize(input);
    }

};

export { deserializeIdmEvent };
