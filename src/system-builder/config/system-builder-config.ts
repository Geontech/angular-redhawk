import { DomainSubsystem } from './domain-subsystem';

/** SystemBuilder Configuration for the arSystemBuilder */
export interface SystemBuilderConfig {
  /** The Domain where the subsystems will be found */
  domain: DomainSubsystem;
}
