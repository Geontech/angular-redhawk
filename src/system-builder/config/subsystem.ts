/**
 * Subsystem reference to match.  The id and name can be regular expressions.
 */
export interface Subsystem {
  /** The string/regex to match agains the subsystem's ID */
  id?: string;
  /** The string/regex to match agains the subsystem's Name */
  name?: string;
  /** Can be an InjectionToken or class */
  token: any;
}
