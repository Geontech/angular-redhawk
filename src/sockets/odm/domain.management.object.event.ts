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

export function resolve(category: string): SourceCategory {
    switch (category) {
        case 'DEVICE_MANAGER':
            return SourceCategory.DEVICE_MANAGER;
        case 'DEVICE':
            return SourceCategory.DEVICE;
        case 'APPLICATION_FACTORY':
            return SourceCategory.APPLICATION_FACTORY;
        case 'APPLICATION':
            return SourceCategory.APPLICATION;
        case 'SERVICE':
            return SourceCategory.SERVICE;
        default:
            return SourceCategory.UNKNOWN;
    }
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
        this.sourceCategory = resolve(input.sourceCategory.value);
        return this;
    }
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

@Pipe({ name: 'arSourceCategory'})
export class SourceCategoryPipe implements PipeTransform {
    transform (category: SourceCategory): string {
        return SourceCategory[category];
    }
}
