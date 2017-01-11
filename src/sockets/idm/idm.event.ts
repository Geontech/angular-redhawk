import { ISerializableFn } from '../../shared/serializable';

import { UsageStateEvent } from './usage.state.event';
import { AdministrativeStateEvent } from './administrative.state.event';
import { OperationalStateEvent } from './operational.state.event';
import { AbnormalComponentTerminationEvent } from './abnormal.component.termination.event';

export { UsageStateEvent, UsageState } from './usage.state.event';
export { AdministrativeStateEvent, AdministrativeState } from './administrative.state.event';
export { OperationalStateEvent, OperationalState } from './operational.state.event';
export { AbnormalComponentTerminationEvent } from './abnormal.component.termination.event';

/**
 * @type IdmEvent
 * This is a false union type since AbnormalComponentTerminationEvent shares
 * nothing with the *StateEvent types.  We're doing this here because there is
 * no other appopriate way to describe this fact.
 */
export type IdmEvent =
    UsageStateEvent |
    AdministrativeStateEvent |
    OperationalStateEvent |
    AbnormalComponentTerminationEvent;

// Type-guards since you can't instanceof or typeof a "type" in TypeScript
export function isAdministrativeStateEvent(event: IdmEvent): event is AdministrativeStateEvent {
    return event instanceof AdministrativeStateEvent;
}

export function isOperationalStateEvent(event: IdmEvent): event is OperationalStateEvent {
    return event instanceof OperationalStateEvent;
}

export function isUsageStateEvent(event: IdmEvent): event is UsageStateEvent {
    return event instanceof UsageStateEvent;
}

export function isAbnormalComponentTerminationEvent(event: IdmEvent): event is AbnormalComponentTerminationEvent {
    return event instanceof AbnormalComponentTerminationEvent;
}

export function isIdmEvent(event: any): event is IdmEvent {
    return isAdministrativeStateEvent(event) ||
           isOperationalStateEvent(event) ||
           isUsageStateEvent(event) ||
           isAbnormalComponentTerminationEvent(event);
}

// Deserialization function for all IdmEvent types
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
