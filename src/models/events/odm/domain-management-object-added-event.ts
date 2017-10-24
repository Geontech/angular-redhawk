import { ISerializable } from '../../serialization/index';

import { DomainManagementObjectRemovedEvent } from './domain-management-object-removed-event';

/**
 * Serializable REDHAWK Domain Object Added Event
 */
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
