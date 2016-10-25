import { ISerializable } from '../shared/serializable';

// SCA Types
export type ScaType = 'simple' | 'simpleSeq' | 'struct' | 'structSeq';
export type ScaSimpleType = 'simple';
export type ScaSimpleSeqType = 'simpleSeq';
export type ScaStructType = 'struct';
export type ScaStructSeqType = 'structSeq';

// Property Access Mode
export type Mode = 'readwrite' | 'writeonly' | 'readonly';

// Property Value Types
export type SimpleValueType = string | number | boolean;
export type SimpleSeqValueType = Array<SimpleValueType>;
export type StructValueType = Array<SimpleProperty | SimpleSeqProperty>;
export type StructSeqValueType = Array<StructProperty>;
export type AnyValueType = SimpleValueType | SimpleSeqValueType | StructValueType | StructSeqValueType;

// Various "kinds"
export type ScaKindPre200 =
    'allocation' |
    'configure' |
    'execparam' |
    'message' |
    'event';
export type ScaKindPost200 =
    'allocation' |
    'property' |
    'message';

export abstract class Property implements ISerializable<Property> {
    id: string;
    name: string;
    value: AnyValueType;
    scaType: ScaType;
    kinds: Array<ScaKindPre200> | ScaKindPost200 = 'property';
    mode: Mode = 'readwrite';

    constructor(id?: string, name?: string, value?: AnyValueType) {
        this.id = id;
        this.name = name;
        this.value = value;
    }

    /** WARNING: This is a partial deserialization.  Used derived classes instead */
    deserialize(input: any) {
        this.id = input.id;
        this.name = input.name;
        this.mode = input.mode;
        this.kinds = input.kinds;
        return this;
    }
}

export type PropertySet = Array<Property>;

export class SimpleCommon extends Property {
    type: string = 'string';
    enumerations: { [key: string]: string };
}

/** **************
 * DERIVED CLASSES
 * ***************
 */

/**
 * @class A 'simple' Property
 */
export class SimpleProperty extends SimpleCommon implements ISerializable<SimpleProperty> {
    value: SimpleValueType;
    scaType: ScaSimpleType = 'simple';

    deserialize(input: any) {
        super.deserialize(input);
        this.scaType = input.scaType;
        this.type = input.type;
        this.enumerations = input.enumerations;
        this.value = input.value;
        return this;
    }
}

/**
 * @class A 'simpleSeq' Property
 */
export class SimpleSeqProperty extends SimpleCommon implements ISerializable<SimpleSeqProperty> {
    value: SimpleSeqValueType;
    scaType: ScaSimpleSeqType = 'simpleSeq';

    deserialize(input: any) {
        super.deserialize(input);
        this.scaType = input.scaType;
        this.type = input.type;
        this.enumerations = input.enumerations;
        this.value = input.value || [];
        return this;
    }
}

/**
 * @class A 'struct' Property
 */
export class StructProperty extends Property implements ISerializable<StructProperty> {
    value: StructValueType;
    scaType: ScaStructType = 'struct';

    /**
     * @return {string[]} List of field IDs in this structure
     */
    get fields(): string[] {
        let fields: string[] = [];
        for (let field of this.value) {
            fields.push(field.id);
        }
        return fields;
    }

    /**
     * Helper function to get individual fields from the struct's list of fields.
     * @param {string} id The ID of the field/member to return
     */
    field(id: string): SimpleProperty | SimpleSeqProperty {
        for (let field of this.value) {
            if (field.id === id) {
                return field;
            }
        }
        return undefined;
    }

    deserialize(input: any) {
        super.deserialize(input);
        this.scaType = input.scaType;
        this.value = [] as StructValueType;
        for (let field of input.value) {
            if (field.scaType === 'simple') {
                this.value.push(<SimpleProperty> deserializeProperty(field));
            } else if (field.scaType === 'simpleSeq') {
                this.value.push(<SimpleSeqProperty> deserializeProperty(field));
            }
        }
        return this;
    }
}

/**
 * @class A 'structSeq' Property
 */
export class StructSeqProperty extends Property implements ISerializable<StructSeqProperty> {
    value: StructSeqValueType;
    scaType: ScaStructSeqType = 'structSeq';

    deserialize(input: any) {
        super.deserialize(input);
        this.scaType = input.scaType;
        this.value = [] as StructSeqValueType;
        for (let sub of input.value) {
            this.value.push(<StructProperty> deserializeProperty(sub));
        }
        return this;
    }
}

/**
 * @input {any} input A JSON Object to convert to a Property subclass.
 */
export function deserializeProperty(input: any): SimpleProperty | SimpleSeqProperty | StructProperty | StructSeqProperty {
    let p: SimpleProperty | SimpleSeqProperty | StructProperty | StructSeqProperty;
    switch (input.scaType) {
        case 'simpleSeq':
            p = new SimpleSeqProperty().deserialize(input);
            break;
        case 'struct':
            p = new StructProperty().deserialize(input);
            break;
        case 'structSeq':
            p = new StructSeqProperty().deserialize(input);
            break;
        case 'simple':
            // tslint:disable-next-line:no-switch-case-fall-through
        default:
            p = new SimpleProperty().deserialize(input);
            break;
    }
    return p;
}

/**
 * @param {any} inputs A JSON Object that is a list of Property objects
 */
export function deserializeProperties(inputs: any): PropertySet {
    let props: PropertySet = [];
    for (let input of inputs) {
        props.push(deserializeProperty(input));
    }
    return props;
}

/**
 * @interface Property command structure
 */
export interface IPropertyCommand {
    properties: PropertySet;
}
export class PropertyCommand implements IPropertyCommand {
    constructor(public properties: PropertySet) {}
}
