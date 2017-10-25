import { ISerializable } from '../../serialization/index';

import { OdmEvent } from './odm-event';

/**
 * Base class for REDHAWK Domain Management object events (add/remove)
 */
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
