import { ISerializable } from '../serialization/index';

/**
 * Base class reference to a Resource (Device and Component).  This object is
 * only the id-name pair one would find in a Device Manager's devices array,
 * not the full model.
 */
export class ResourceRef implements ISerializable<ResourceRef> {
    public name: string;
    public id: string;

    deserialize(input: any) {
        this.name = input.name;
        this.id = input.id;
        return this;
    }
}
