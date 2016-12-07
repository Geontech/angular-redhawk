import { ISerializable } from '../../shared/serializable';
import { OdmStateEvent, ChangeType } from './odm.state.event';
import { resolveSourceCategory }from './odm.event';



export class DomainManagementObjectChangedEvent
    extends OdmStateEvent<ChangeType>
    implements ISerializable<DomainManagementObjectChangedEvent> {
    deserialize(input: any) {
        super.deserialize(input);
        this.producerId = input.producerId;
        this.sourceCategory = resolveSourceCategory(input.sourceCategory.value);
        if (input.hasOwnProperty('sourceIOR') ) {
            this.changeType = ChangeType.ADDED;
        } else {
            this.changeType = ChangeType.REMOVED;
        }
        return this;
    }
}
