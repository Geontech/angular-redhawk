import { Property } from './property';

/**
 * Common base class for Simple and SimpleSeq types which have
 * the ability to express values as enumerations
 */
export class SimpleCommon extends Property {
    type:         string;
    enumerations: { [key: string]: string };
}
