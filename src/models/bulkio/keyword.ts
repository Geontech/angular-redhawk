import { ISerializableFn } from '../serialization/index';

/**
 * Keywords are just a map, basically.
 */
export type Keywords = Map<string, any>;

let deserializeKeywords: ISerializableFn<Keywords>;
deserializeKeywords = function (inputs?: any): Keywords {
    return <Keywords> inputs;
};

export { deserializeKeywords }
