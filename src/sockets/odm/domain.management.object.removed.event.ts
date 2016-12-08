import { ISerializable } from '../../shared/serializable';
import { OdmStateEvent } from './odm.state.event';
import { resolveSourceCategory }from './odm.event';



export class DomainManagementObjectRemovedEvent
    extends OdmStateEvent
    implements ISerializable<DomainManagementObjectRemovedEvent> {
    deserialize(input: any) {
        super.deserialize(input);
        this.producerId = input.producerId;
        this.sourceCategory = resolveSourceCategory(input.sourceCategory.value);
        return this;
    }
}
