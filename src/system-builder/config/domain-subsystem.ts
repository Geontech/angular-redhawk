import { Subsystem } from './subsystem';
import { DeviceManagerSubsystem } from './device-manager-subsystem';
import { WaveformSubsystem } from './waveform-subsystem';

/**
 * Domain Subsystem configuration
 */
export interface DomainSubsystem extends Subsystem {
  /** Device Manager configurations in this domain */
  deviceManagers?: DeviceManagerSubsystem[];
  /** Waveform configurations in this domain */
  waveforms?: WaveformSubsystem[];
}
