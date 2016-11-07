import { ISerializable } from '../../shared/serializable';
import { IdmStateEvent } from './idm.state.event';

export enum UsageState {
    IDLE,
    ACTIVE,
    BUSY
}

export type TUsageState = 'IDLE' | 'ACTIVE' | 'BUSY';

export function resolve(category: TUsageState): UsageState {
    switch (<TUsageState> category) {
        case 'IDLE':
            return UsageState.IDLE;
        case 'ACTIVE':
            return UsageState.ACTIVE;
        case 'BUSY':
        // tslint:disable-next-line:no-switch-case-fall-through
        default:
            return UsageState.BUSY;
    }
}

export class UsageStateEvent extends IdmStateEvent<UsageState> implements ISerializable<UsageStateEvent> {
    deserialize(input: any) {
        super.deserialize(input);
        this.stateChangeFrom = resolve(input.stateChangeFrom);
        this.stateChangeTo = resolve(input.stateChangeTo);
        return this;
    }
}