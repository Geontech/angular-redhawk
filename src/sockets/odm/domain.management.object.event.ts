import { Pipe, PipeTransform } from '@angular/core';

import { ISerializable } from '../../shared/serializable';
import { OdmEvent } from './odm.event.base';

export enum SourceCategory {
    DEVICE_MANAGER,
    DEVICE,
    APPLICATION_FACTORY,
    APPLICATION,
    SERVICE,
    UNKNOWN
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

// Base class for domain management object events (add/remove)
export class DomainManagementObjectEvent
    extends OdmEvent
    implements ISerializable<DomainManagementObjectEvent> {

    public producerId: string;

    deserialize(input: any) {
        super.deserialize(input);
        this.producerId = input.producerId;
        return this;
    }
}

// Object Removed Event
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

export function isDomainManagementObjectRemovedEvent(ev: OdmEvent): ev is DomainManagementObjectRemovedEvent {
    return ev instanceof DomainManagementObjectRemovedEvent;
}

// Object Added Event
export class DomainManagementObjectAddedEvent
    extends DomainManagementObjectRemovedEvent
    implements ISerializable<DomainManagementObjectAddedEvent> {

    public sourceIOR: any;

    deserialize(input: any) {
        super.deserialize(input);
        this.sourceIOR = {};
        return this;
    }
}

export function isDomainManagementObjectAddedEvent(ev: OdmEvent): ev is DomainManagementObjectAddedEvent {
    return ev instanceof DomainManagementObjectAddedEvent;
}

@Pipe({ name: 'arSourceCategory'})
export class SourceCategoryPipe implements PipeTransform {
    transform (category: SourceCategory): string {
        return SourceCategory[category];
    }
}
