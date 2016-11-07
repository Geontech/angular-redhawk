import { ISerializable } from '../../shared/serializable';

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