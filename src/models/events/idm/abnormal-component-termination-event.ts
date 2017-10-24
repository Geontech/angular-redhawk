import { ISerializable } from '../../serialization/index';

import { IdmEvent } from './idm-event';

/**
 * Serializable REDHAWK IDM Abnormal Component Termination Event model
 */
export class AbnormalComponentTerminationEvent
    extends IdmEvent
    implements ISerializable<AbnormalComponentTerminationEvent> {
        
        public deviceId: string;
        public componentId: string;
        public applicationId: string;

        deserialize(input: any) {
            this.deviceId      = input.deviceId;
            this.componentId   = input.componentId;
            this.applicationId = input.applicationId;
            return this;
        }
}
