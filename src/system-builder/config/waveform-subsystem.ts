import { Subsystem } from './subsystem';

/**
 * Waveform (Application) Subsystem configuration
 */
export interface WaveformSubsystem extends Subsystem {
  components?: Subsystem[];
}
