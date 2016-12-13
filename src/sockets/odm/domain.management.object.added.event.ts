import { ISerializable } from '../../shared/serializable';
import { OdmStateEvent } from './odm.state.event';
import { resolveSourceCategory }from './odm.event';



export class DomainManagementObjectAddedEvent
    extends OdmStateEvent
    implements ISerializable<DomainManagementObjectAddedEvent> {
    deserialize(input: any) {
        super.deserialize(input);
        this.sourceIOR = {};
        this.producerId = input.producerId;
        this.sourceCategory = resolveSourceCategory(input.sourceCategory.value);
        return this;
    }
}
