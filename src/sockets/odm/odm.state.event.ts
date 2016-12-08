import { ISerializable } from '../../shared/serializable';
import { SourceCategory } from './odm.event';

export enum ResourceStateChangeType {
    STOPPED,
    STARTED
}

export type TResourceStateChangeType = 'STOPPED' | 'STARTED';

// Generic ODM state event
export class OdmStateEvent implements ISerializable<OdmStateEvent> {
    sourceId: string;
    sourceName: string;
    producerId: string;
    sourceIOR: any;
    sourceCategory: SourceCategory;
    stateChangeFrom: ResourceStateChangeType;
    stateChangeTo: ResourceStateChangeType;

    deserialize(input: any) {
        this.sourceId = input.sourceId;
        this.sourceName = input.sourceName;
        return this;
    }

}
