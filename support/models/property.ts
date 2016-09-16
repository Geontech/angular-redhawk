export type CFPropertySet = CFProperty[];
export class PropertyBase {
    public id: string;
    public name: string;
    public value: SimpleValueType | SimpleSeqValueType | StructValueType | StructSeqValueType;
}
export class CFProperty extends PropertyBase {
    public kinds: string[] | string;
    public scaType: SCAType;
    public mode: Mode;
    public type: string;
    public enumerations: any[];
}

export type SCAType = "simple" | "simpleSeq" | "struct" | "structSeq";
export type Mode = "readwrite" | "writeonly" | "readonly";
export type SimpleValueType = string | number | boolean;
export type SimpleSeqValueType = SimpleValueType[];
export type StructValueType = CFProperty;
export type StructSeqValueType = StructValueType[];
