import { ISerializableFn } from './serializable-fn';

/**
 * The Serializable Interface represents an object that can update its members
 * of type T using a JSON object.
 */
export interface ISerializable<T> {
    /**
     * Updates this instance with the fields from a JSON object of the same type.
     * @example new DerivedClass().deserialize(jsonObject);
     * @param input JSON Object to deserialize into type T
     */
    deserialize: ISerializableFn<T>;
}
