import { ISerializable } from '../../serialization/index';

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
