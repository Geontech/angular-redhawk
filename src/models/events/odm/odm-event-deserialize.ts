import { ISerializableFn } from '../../serialization/index';

// Base class and children to deserialize.
import { OdmEvent } from './odm-event';
import { DomainManagementObjectAddedEvent } from './domain-management-object-added-event';
import { DomainManagementObjectRemovedEvent } from './domain-management-object-removed-event';
import { ResourceStateChangeEvent } from './resource-state-change-event';

let deserializeOdmEvent: ISerializableFn<OdmEvent>;
deserializeOdmEvent = function (input: any) {
    if (input.hasOwnProperty('producerId')) {
        if (input.hasOwnProperty('sourceIOR')) {
            return new DomainManagementObjectAddedEvent().deserialize(input);
        } else {
            return new DomainManagementObjectRemovedEvent().deserialize(input);
        }
    } else if (input.hasOwnProperty('stateChangeFrom')) {
        return new ResourceStateChangeEvent().deserialize(input);
    }
    return null;
};

export { deserializeOdmEvent };
