// Represents REDHAWK update event structure indicating the state of domain changes.
export class RedhawkEvent {
    public domains: Array<string>;
    public added: Array<string>;
    public removed: Array<string>;
}

export class Redhawk {
    public domains: Array<string>;
}
