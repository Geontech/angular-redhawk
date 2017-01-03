import { ISerializable } from '../../shared/serializable';

export class AbnormalComponentTerminationEvent implements ISerializable<AbnormalComponentTerminationEvent> {
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
