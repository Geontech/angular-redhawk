import { ISerializableFn } from './serializable-fn';

/**
 * The Serializable Interface represents an object that can update its members
 * of type T using a JSON object.
 */
export interface ISerializable<T> {
    deserialize: ISerializableFn<T>;
}
