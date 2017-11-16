import { ISerializable } from '../serialization/index';

/**
 * Base class reference to a Resource (Device, Component, etc.).  This object is
 * only the id-name pair one would find in a Device Manager's devices array,
 * not the full model.
 * 
 * NOTE: This is not related to the Core Framework Resource class!  The English
 * word made sense for these objects that are ID-name pairs since they are
 * resource references (ResourceRef) on the REST server that resolve into actual
 * resource entities at the server.
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
