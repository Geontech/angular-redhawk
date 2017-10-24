import { ISerializable } from '../../base/serializable';

export interface ISimpleProperty {
    id: string;
    value: any;
}

export type ISimpleProperties = ISimpleProperty[];

export class RhMessage implements ISerializable<RhMessage> {
    id: string;
    value: ISimpleProperties;

    deserialize(input: any) {
        this.id = input.id;
        this.value = input.value;
        return this;
    }
}

// Typeguard for interface parity between other event types on channels.
// This is logically obvious since all messages found on a channel have this
// one structure, RhMessage.
export function isRhMessage(event: any): event is RhMessage {
    return event instanceof RhMessage;
}
