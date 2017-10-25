/**
 * Resource models module represent the serializable base classes for references
 * to the server side models as well as the models themselves (i.e., Devices and
 * Components).  This is also used in the Waveform, DeviceManager, and Domain 
 * because the reference listings are all id-name lists of endpoints.
 */
import { ResourceRef } from './resource-ref';

export { ResourceRef } from './resource-ref';
export { Resource } from './resource';

/**
 * List of ResourceRefs typical of Waveforms and DeviceManagers
 */
export type ResourceRefs = ResourceRef[];

/**
 * Utility function for deserializing a list of resource refs.
 */
export function deserializeResourceRefs(inputs: any = []): ResourceRefs {
    let refs: ResourceRefs = [];
    for (let ref of inputs) {
        refs.push(new ResourceRef().deserialize(ref));
    }
    return refs;
}
