import { Subsystem } from './subsystem';

/**
 * Device Manager (Node) Subsystem configuration
 */
export interface DeviceManagerSubsystem extends Subsystem {
  devices?: Subsystem[];
}
