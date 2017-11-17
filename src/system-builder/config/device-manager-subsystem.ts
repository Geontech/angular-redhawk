import { Subsystem } from './subsystem';

/**
 * Device Manager (Node) Subsystem configuration
 */
export interface DeviceManagerSubsystem extends Subsystem {
  /** Devices in this Device Manager */
  devices?: Subsystem[];
}
