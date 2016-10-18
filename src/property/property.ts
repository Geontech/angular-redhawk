// SCA Types
export type ScaType = 'simple' | 'simpleSeq' | 'struct' | 'structSeq';

// Property Access Mode
export type Mode = 'readwrite' | 'writeonly' | 'readonly';

// Property Value Types
export type SimpleValueType = string | number | boolean;
export type SimpleSeqValueType = Array<SimpleValueType>;
export type StructValueType = Array<Property>;
export type StructSeqValueType = Array<StructValueType>;
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

export type PropertySet = Array<Property>;
export class PropertyBase {
    public id: string;
    public name: string;
    public value: AnyValueType;

    constructor(id?: string, name?: string, value?: AnyValueType) {
        this.id = id;
        this.name = name;
        this.value = value;
    }
}

export class Property extends PropertyBase {
    public kinds: Array<ScaKindPre200> | ScaKindPost200;
    public scaType: ScaType;
    public mode: Mode;
    public type: string;
    public enumerations: {[key: string]: string};

    static Simple(id: string, name: string, value: SimpleValueType): Property {
        let p = new Property(id, name, value);
        p.scaType = 'simple';
        return p;
    }

    static SimpleSeq(id: string, name: string, value: SimpleSeqValueType): Property {
        let p = new Property(id, name, value);
        p.scaType = 'simpleSeq';
        return p;
    }

    static Struct(id: string, name: string, value: StructValueType): Property {
        let p = new Property(id, name, value);
        p.scaType = 'struct';
        return p;
    }

    static StructSeq(id: string, name: string, value: StructSeqValueType): Property {
        let p = new Property(id, name, value);
        p.scaType = 'structSeq';
        return p;
    }

    constructor(id?: string, name?: string, value?: AnyValueType) {
        super(id, name, value);
        this.kinds = 'property';
        this.mode = 'readwrite';
        this.type = 'string';
        this.enumerations = null;
    }
}

// Property command
export class PropertyCommand {
    constructor(public properties: PropertySet) {};
}
