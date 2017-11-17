import { ISerializable } from '../../serialization/index';

import { DomainManagementObjectRemovedEvent } from './domain-management-object-removed-event';

/**
 * Serializable REDHAWK Domain Object Added Event
 */
export class DomainManagementObjectAddedEvent
    extends DomainManagementObjectRemovedEvent
    implements ISerializable<DomainManagementObjectAddedEvent> {

    /** Source IOR (unused) */
    public sourceIOR: any;

    /** Deserializes a JSON object into this class */
    deserialize(input: any) {
        super.deserialize(input);
        this.sourceIOR = {};
        return this;
    }
}
