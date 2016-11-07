import { ISerializable } from '../../shared/serializable';

// Generic IDM state event
export class IdmStateEvent<T> implements ISerializable<IdmStateEvent<T>> {
    sourceId: string;
    stateChangeFrom: T;
    stateChangeTo: T;

    deserialize(input: any) {
        this.sourceId = input.sourceId;
        return this;
    }
}
