/**
 * The Serializable Function (Fn) interface serializes a JSON object into
 * some object of type T.
 */
export interface ISerializableFn<T> {
    /** The deserialization function */
    (jsonObj: Object): T;
}
