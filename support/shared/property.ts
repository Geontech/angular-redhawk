export type CFPropertySet = Array<CFProperty>;
export class PropertyBase {
    public id: string;
    public name: string;
    public value: SimpleValueType | SimpleSeqValueType | StructValueType | StructSeqValueType;
}
export class CFProperty extends PropertyBase {
    public kinds: Array<string> | string;
    public scaType: SCAType;
    public mode: Mode;
    public type: string;
    public enumerations: Array<any>;
}

export type SCAType = "simple" | "simpleSeq" | "struct" | "structSeq";
export type Mode = "readwrite" | "writeonly" | "readonly";
export type SimpleValueType = string | number | boolean;
export type SimpleSeqValueType = Array<SimpleValueType>;
export type StructValueType = CFProperty;
export type StructSeqValueType = Array<StructValueType>;
