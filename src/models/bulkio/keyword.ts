import { ISerializableFn } from '../serialization/index';

/**
 * Keywords are basic JS object, however we're converting
 * it to a Map to avoid concerns about object member names.
 */
export type Keywords = Map<string, any>;

let deserializeKeywords: ISerializableFn<Keywords>;
deserializeKeywords = function (inputs?: any): Keywords {
    let keys: Keywords = new Map<string, any>();
    if (inputs) {
        Object.keys(inputs).forEach(key => {
            keys.set(key, inputs[key]);
        });
    }
    return keys;
};

export { deserializeKeywords }
