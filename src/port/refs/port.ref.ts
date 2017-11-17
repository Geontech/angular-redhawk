/**
 * TBD
 * Base class for port references.
 */
export class PortRef {
    /**
     * Constructor
     * @param url REST URL of the port
     */
    constructor (public url: string) { /** */ }

    /**
     * If this port reference is being deleted/removed, call this method.
     */
    release(): void { /** base reference does nothing */ };
}
