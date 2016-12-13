import { ISerializable } from '../../shared/serializable';
import { IdmStateEvent } from './idm.state.event';

export enum AdministrativeState {
    LOCKED,
    UNLOCKED,
    SHUTTING_DOWN
}

export type TAdministrativeState = 'LOCKED' | 'UNLOCKED' | 'SHUTTING_DOWN';

export function resolve(category: TAdministrativeState): AdministrativeState {
    switch (<TAdministrativeState> category) {
        case 'LOCKED':
            return AdministrativeState.LOCKED;
        case 'UNLOCKED':
            return AdministrativeState.UNLOCKED;
        case 'SHUTTING_DOWN':
        // tslint:disable-next-line:no-switch-case-fall-through
        default:
            return AdministrativeState.SHUTTING_DOWN;
    }
}

export class AdministrativeStateEvent
    extends IdmStateEvent<AdministrativeState>
    implements ISerializable<AdministrativeStateEvent> {
    deserialize(input: any) {
        super.deserialize(input);
        this.stateChangeFrom = resolve(input.stateChangeFrom.value);
        this.stateChangeTo = resolve(input.stateChangeTo.value);
        return this;
    }
}
