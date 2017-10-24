/**
 * Devices support configuring, allocating and deallocating properties.  The
 * server side method is identical for all 3 with the difference being this 
 * command enumeration.
 */
export type DevicePropertyCommandType = 'configure' | 'allocate' | 'deallocate';
