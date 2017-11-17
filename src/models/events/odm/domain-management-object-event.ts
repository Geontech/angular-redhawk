import { ISerializable } from '../../serialization/index';

import { OdmEvent } from './odm-event';

/**
 * Base class for REDHAWK Domain Management object events (add/remove)
 */
export class DomainManagementObjectEvent
    extends OdmEvent
    implements ISerializable<DomainManagementObjectEvent> {

    /** Entity that produced this event */
    public producerId: string;

    /** Deserializes a JSON object into this class */
    deserialize(input: any) {
        super.deserialize(input);
        this.producerId = input.producerId;
        return this;
    }
}
