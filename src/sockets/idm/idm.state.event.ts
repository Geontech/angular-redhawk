import { ISerializable } from '../../base/serializable';

import { IdmEvent } from './idm.event.base';

export enum StateChangeCategory {
    ADMINISTRATIVE_STATE_EVENT,
    OPERATIONAL_STATE_EVENT,
    USAGE_STATE_EVENT,
    UNKNOWN
}

export function fromString(category: string): StateChangeCategory {
    let out = StateChangeCategory.UNKNOWN;
    switch (category) {
        case 'ADMINISTRATIVE_STATE_EVENT':
            out = StateChangeCategory.ADMINISTRATIVE_STATE_EVENT;
            break;
        case 'OPERATIONAL_STATE_EVENT':
            out = StateChangeCategory.OPERATIONAL_STATE_EVENT;
            break;
        case 'USAGE_STATE_EVENT':
            out = StateChangeCategory.USAGE_STATE_EVENT;
            break;
        default:
            console.error('Unknown StateChangeCategory: ' + category);
            break;
    }
    return out;
}

// Generic IDM state event
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
