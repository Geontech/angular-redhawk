export class PortRef {
    constructor (public url: string) { /** */ }

    /**
     * If this port reference is being deleted/removed, call this method.
     */
    release(): void { /** base reference does nothing */ };
}
