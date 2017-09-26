import { ISerializable } from '../../shared/serializable';

import { IdmEvent } from './idm.event.base';

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

export function isAbnormalComponentTerminationEvent(event: IdmEvent): event is AbnormalComponentTerminationEvent {
    return event instanceof AbnormalComponentTerminationEvent;
}
