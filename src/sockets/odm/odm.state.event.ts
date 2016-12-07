import { ISerializable } from '../../shared/serializable';
import { SourceCategory } from './odm.event';

export enum ChangeType {
    ADDED,
    REMOVED
}

// Generic ODM state event
export class OdmStateEvent<T> implements ISerializable<OdmStateEvent<T>> {
    sourceId: string;
    sourceName: string;
    producerId: string;
    sourceCategory: SourceCategory;
    changeType: ChangeType;
    stateChangeFrom: T;
    stateChangeTo: T;

    deserialize(input: any) {
        this.sourceId = input.sourceId;
        this.sourceName = input.sourceName;
        return this;
    }

}
