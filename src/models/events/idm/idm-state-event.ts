import { ISerializable } from '../../serialization/index';

import { IdmEvent }            from './idm-event';
import { StateChangeCategory } from './enums/index';

/**
 * Serializable, Generic IDM state event base class
 */
export class IdmStateEvent<T>
    extends IdmEvent
    implements ISerializable<IdmStateEvent<T>> {

        sourceId: string;
        stateChangeFrom: T;
        stateChangeTo: T;

        deserialize(input: any) {
            this.sourceId = input.sourceId;
            return this;
        }
}
