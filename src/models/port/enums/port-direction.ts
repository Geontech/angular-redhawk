/**
 * Enumeration for the direction of the port
 */
export enum PortDirection {
    UNKNOWN,
    Uses,
    Provides
};

/**
 * Convenience function for converting the string direction returned from the
 * server to the enumeration.
 *
 * @param val - The string name of the port direction.
 */
export function resolvePortDirection(val: string): PortDirection {
    let direction: PortDirection = PortDirection.UNKNOWN;
    switch (val) {
        case 'Uses':
            direction = PortDirection.Uses;
            break;
        case 'Provides':
            direction = PortDirection.Provides;
            break;
        default:
            break;
    }
    return direction;
}
