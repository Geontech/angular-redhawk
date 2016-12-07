import { ISerializable } from '../../shared/serializable';
import { IdmStateEvent } from './idm.state.event';

export enum OperationalState {
    ENABLED,
    DISABLED
}

export type TOperationalState = 'ENABLED' | 'DISABLED';

export function resolve(category: TOperationalState): OperationalState {
    switch (<TOperationalState> category) {
        case 'ENABLED':
            return OperationalState.ENABLED;
        case 'DISABLED':
        // tslint:disable-next-line:no-switch-case-fall-through
        default:
            return OperationalState.DISABLED;
    }
}

export class OperationalStateEvent extends IdmStateEvent<OperationalState> implements ISerializable<OperationalStateEvent> {
    deserialize(input: any) {
        super.deserialize(input);
        this.stateChangeFrom = resolve(input.stateChangeFrom.value);
        this.stateChangeTo = resolve(input.stateChangeTo.value);
        return this;
    }
}
