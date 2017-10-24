import { DeviceManagerRef } from './device-manager-ref';

export * from './device-manager';
export * from './device-manager-ref';

/**
 * List of device manager references
 */
export type DeviceManagerRefs = Array<DeviceManagerRef>;

/**
 * Function for deserializing a list of device manager refs, typically used
 * by the Domain.
 */
export function deserializeDeviceManagerRefs(inputs?: any): DeviceManagerRefs {
    if (!inputs) {
        return [];
    }
    let refs: DeviceManagerRefs = [];
    for (let ref of inputs) {
        refs.push(new DeviceManagerRef().deserialize(ref));
    }
    return refs;
}
