// Represents REDHAWK update event structure indicating the state of domain changes.
export class RedhawkEvent {
    public domains: string[];
    public added: string[];
    public removed: string[];
}

export class Redhawk {
    public domains: string[] = [];
}
