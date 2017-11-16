import { Subsystem } from './subsystem';
import { DeviceManagerSubsystem } from './device-manager-subsystem';
import { WaveformSubsystem } from './waveform-subsystem';

/**
 * Domain Subsystem configuration
 */
export interface DomainSubsystem extends Subsystem {
  deviceManagers?: DeviceManagerSubsystem[];
  waveforms?: WaveformSubsystem[];
}
