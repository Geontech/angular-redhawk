import { ISerializable } from '../../serialization/index';

/**
 * All ODM Events have the same basic two properties: sourceId and sourceName.
 * This is a base class and only partially deserializes the event.
 */
export class OdmEvent implements ISerializable<OdmEvent> {
    /** Source ID of the entity related to this event */
    sourceId:     string;
    /** Source Name of the entity related to this event */
    sourceName:   string;

    /** Deserializes a JSON object into this class */
    deserialize(input: any) {
        this.sourceId   = input.sourceId;
        this.sourceName = input.sourceName;
        return this;
    }
}
