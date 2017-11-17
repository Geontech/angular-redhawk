import { Subsystem } from './subsystem';

/**
 * Waveform (Application) Subsystem configuration
 */
export interface WaveformSubsystem extends Subsystem {
  /** Components in this waveform */
  components?: Subsystem[];
}
