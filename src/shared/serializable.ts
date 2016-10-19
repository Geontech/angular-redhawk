export interface ISerializableFn<T> {
    (jsonObj: Object): T;
}

export interface ISerializable<T> {
    deserialize: ISerializableFn<T>;
}
