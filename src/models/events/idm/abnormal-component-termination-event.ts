import { ISerializable } from '../../serialization/index';

import { IdmEvent } from './idm-event';

/**
 * Serializable REDHAWK IDM Abnormal Component Termination Event model
 */
export class AbnormalComponentTerminationEvent
    extends IdmEvent
    implements ISerializable<AbnormalComponentTerminationEvent> {

        /** Device ID that was executing the component */
        public deviceId: string;
        /** Component ID that terminated */
        public componentId: string;
        /** Application ID where the Component was */
        public applicationId: string;

        /** Deserializes a JSON object into this class */
        deserialize(input: any) {
            this.deviceId      = input.deviceId;
            this.componentId   = input.componentId;
            this.applicationId = input.applicationId;
            return this;
        }
}
