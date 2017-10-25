import { ISerializable, ISerializableFn } from '../serialization/index';

/**
 * Serializable REDHAWK SRI Keyword
 */
export class Keyword implements ISerializable<Keyword> {
    id: string;
    value: any;

    deserialize(input: any) {
        this.id = input.id;
        this.value = input.value;
        return this;
    }
}

/**
 * List of Keywords
 */
export type Keywords = Array<Keyword>;

let deserializeKeywords: ISerializableFn<Keywords>;
deserializeKeywords = function (inputs?: any): Keywords {
    let keywords: Keywords = [];
    if (inputs) {
        for (let input of inputs) {
            keywords.push(new Keyword().deserialize(input));
        }
    }
    return keywords;
};

export { deserializeKeywords }
