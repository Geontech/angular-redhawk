import { ISerializable } from '../../serialization/index';

import { IdmEvent }            from './idm-event';

/**
 * Serializable, Generic IDM state event base class
 */
export class IdmStateEvent<T>
    extends IdmEvent
    implements ISerializable<IdmStateEvent<T>> {

        /** Source ID of the event */
        sourceId: string;
        /** The original state of the source */
        stateChangeFrom: T;
        /** The new state of the source */
        stateChangeTo: T;

        /** Deserializes a JSON object into this class */
        deserialize(input: any) {
            this.sourceId = input.sourceId;
            return this;
        }
}
