import { ISerializable } from '../../serialization/index';

import { SourceCategory } from './enums/index';
import { DomainManagementObjectEvent } from './domain-management-object-event';

/**
 * Serializable REDHAWK Domain Object Removed Event
 */
export class DomainManagementObjectRemovedEvent
    extends DomainManagementObjectEvent
    implements ISerializable<DomainManagementObjectRemovedEvent> {

    public sourceCategory: SourceCategory;

    deserialize(input: any) {
        super.deserialize(input);
        this.sourceCategory = fromString(input.sourceCategory.value);
        return this;
    }
}

function fromString (category: string): SourceCategory {
    let out = SourceCategory.UNKNOWN;
    switch (category) {
        case 'DEVICE_MANAGER':
            out = SourceCategory.DEVICE_MANAGER;
            break;
        case 'DEVICE':
            out = SourceCategory.DEVICE;
            break;
        case 'APPLICATION_FACTORY':
            out = SourceCategory.APPLICATION_FACTORY;
            break;
        case 'APPLICATION':
            out = SourceCategory.APPLICATION;
            break;
        case 'SERVICE':
            out = SourceCategory.SERVICE;
            break;
        default:
            // Do anything?
            break;
    }
    return out;
}
