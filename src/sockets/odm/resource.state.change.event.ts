import { ISerializable } from '../../shared/serializable';
import { OdmStateEvent, ResourceStateChangeType, TResourceStateChangeType } from './odm.state.event';



export function
 resolve(state: TResourceStateChangeType): ResourceStateChangeType {
    switch (<TResourceStateChangeType> state) {
        case 'STOPPED':
            return ResourceStateChangeType.STOPPED;
        case 'STARTED':
        // tslint:disable-next-line:no-switch-case-fall-through
        default:
            return ResourceStateChangeType.STARTED;
    }
}

export class ResourceStateChangeEvent
    extends OdmStateEvent
    implements ISerializable<ResourceStateChangeEvent> {
    deserialize(input: any) {
        super.deserialize(input);
        this.stateChangeFrom = resolve(input.stateChangeFrom.value);
        this.stateChangeTo = resolve(input.stateChangeTo.value);
        return this;
    }
}
