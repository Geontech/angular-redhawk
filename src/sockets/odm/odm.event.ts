// Base class and appropriate deserializer for the various children of OdmEvent
export { OdmEvent, isOdmEvent } from './odm.event.base';
export { deserializeOdmEvent  } from './odm.event.deserialize';

// Derived classes and types.
export {
    DomainManagementObjectAddedEvent,
    isDomainManagementObjectAddedEvent,
    DomainManagementObjectRemovedEvent,
    isDomainManagementObjectRemovedEvent,
    SourceCategory
} from './domain.management.object.event';

export {
    ResourceStateChangeEvent,
    isResourceStateChangeEvent,
    ResourceStateChange
} from './resource.state.change.event';
