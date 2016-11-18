export enum PortDirection {
    UNKNOWN,
    Uses,
    Provides
};

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