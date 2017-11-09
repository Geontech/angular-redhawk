import { Subsystem } from './subsystem';
import { DeviceManagerSubsystem } from './device-manager-subsystem';

/**
 * Domain Subsystem configuration
 */
export interface DomainSubsystem extends Subsystem {
  deviceManagers?: DeviceManagerSubsystem[];
}
