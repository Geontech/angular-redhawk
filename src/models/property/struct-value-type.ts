import { SimpleProperty } from './simple-property';
import { SimpleSeqProperty } from './simple-seq-property';

/**
 * REDHAWK Struct Property values are a list of Simple or SimpleSeq Property models
 */
export type StructValueType = Array<SimpleProperty | SimpleSeqProperty>;
