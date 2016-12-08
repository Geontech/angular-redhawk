import { ISerializableFn } from '../../shared/serializable';

import { DomainManagementObjectAddedEvent } from './domain.management.object.added.event';
import { DomainManagementObjectRemovedEvent } from './domain.management.object.removed.event';
import { ResourceStateChangeEvent } from './resource.state.change.event';
import { ResourceStateChangeType } from './odm.state.event';
export type OdmEvent = DomainManagementObjectAddedEvent | ResourceStateChangeEvent;

export { DomainManagementObjectAddedEvent } from './domain.management.object.added.event';
export { DomainManagementObjectRemovedEvent } from './domain.management.object.removed.event';
export { ResourceStateChangeEvent } from './resource.state.change.event';
export { ResourceStateChangeType } from './odm.state.event';
export enum SourceCategory {
    DEVICE_MANAGER,
    DEVICE,
    APPLICATION_FACTORY,
    APPLICATION,
    SERVICE
}

export type TSourceCategory =
    'DEVICE_MANAGER' |
    'DEVICE' |
    'APPLICATION_FACTORY' |
    'APPLICATION' |
    'SERVICE';

export function resolveSourceCategory(category: TSourceCategory): SourceCategory {
    switch (<TSourceCategory> category) {
        case 'DEVICE_MANAGER':
            return SourceCategory.DEVICE_MANAGER;
        case 'DEVICE':
            return SourceCategory.DEVICE;
        case 'APPLICATION_FACTORY':
            return SourceCategory.APPLICATION_FACTORY;
        case 'APPLICATION':
            return SourceCategory.APPLICATION;
        case 'SERVICE':
        // tslint:disable-next-line:no-switch-case-fall-through
        default:
            return SourceCategory.SERVICE;
    }
}


type TOdmEventCategory =
    'DOMAIN_MANAGEMENT_OBJECT_EVENT' |
    'RESOURCE_STATE_CHANGE_EVENT';

let deserializeOdmEvent: ISerializableFn<OdmEvent>;
deserializeOdmEvent = function (input: any) {
    if (input.hasOwnProperty('producerId')) {
        if (input.hasOwnProperty('sourceIOR')) {
            return new DomainManagementObjectAddedEvent().deserialize(input);
        } else {
            return new DomainManagementObjectRemovedEvent().deserialize(input);
        }
    } else {
        return new ResourceStateChangeEvent().deserialize(input);
    }
};

export { deserializeOdmEvent };
