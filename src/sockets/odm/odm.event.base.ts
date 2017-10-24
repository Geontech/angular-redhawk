import { ISerializable } from '../../base/serializable';

// All ODM Events have the same basic two properties: sourceId and sourceName
// This is a base class and only partially deserializes the event.
export class OdmEvent implements ISerializable<OdmEvent> {
    sourceId:     string;
    sourceName:   string;

    deserialize(input: any) {
        this.sourceId   = input.sourceId;
        this.sourceName = input.sourceName;
        return this;
    }
}

// Typeguard simply for interface parity between the ODM and IDM event
// interfaces.  Yes, this is logically obvious at this time since all ODM
// events thus far in the API can inherit from OdmEvent.
export function isOdmEvent(event: any): event is OdmEvent {
    return event instanceof OdmEvent;
}
