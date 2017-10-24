import { SimpleValueType } from './simple-value-type';
import { SimpleSeqValueType } from './simple-seq-value-type';
import { StructValueType } from './struct-value-type';
import { StructSeqValueType } from './struct-seq-value-type';

/**
 * Any possible REDHAWK Property 'value' Types
 */
export type AnyValueType =
    SimpleValueType |
    SimpleSeqValueType |
    StructValueType |
    StructSeqValueType;
