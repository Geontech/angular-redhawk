/**
 * This is a false "type" since AbnormalComponentTerminationEvent shares
 * nothing with the *StateEvent types.  We're doing this here because there is
 * no other appopriate way to describe this fact that Angular will accept
 * since union types do not become JS code.  Hence we use this abstract class
 * for the sake of simplifying downstream logic.
 */
export abstract class IdmEvent {
    /** Deserializes a JSON object into this class */
    abstract deserialize(v: any);
}

/**
 * Typeguard simply for interface parity between the ODM and IDM event
 * interfaces.  Yes, this is logically obvious at this time since all ODM
 * events thus far in the API can inherit from OdmEvent.
 */
export function isIdmEvent(event: any): event is IdmEvent {
    return event instanceof IdmEvent;
}
