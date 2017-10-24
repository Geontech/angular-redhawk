import { Property } from './property';
import { PropertySet } from './property-set';
import { SimpleProperty } from './simple-property';
import { SimpleSeqProperty } from './simple-seq-property';
import { StructProperty } from './struct-property';
import { StructSeqProperty } from './struct-seq-property';

/**
 * List of REDHAWK Property Models
 */
export type PropertySet = Array<Property>;

/**
 * Helper method to deserialize JSON properties into a REDHAWK PropertySet.
 *
 * @param [inputs] A JSON Object that is a PropertySet
 */
export function deserializeProperties(inputs?: any): PropertySet {
    let props: PropertySet = [];
    for (let input of inputs) {
        if (input !== undefined) {
            let p: SimpleProperty | SimpleSeqProperty | StructProperty | StructSeqProperty;
            switch (input.scaType) {
                case 'simpleSeq':
                    p = new SimpleSeqProperty().deserialize(input);
                    break;
                case 'struct':
                    p = new StructProperty().deserialize(input);
                    break;
                case 'structSeq':
                    p = new StructSeqProperty().deserialize(input);
                    break;
                case 'simple':
                    // tslint:disable-next-line:no-switch-case-fall-through
                default:
                    p = new SimpleProperty().deserialize(input);
                    break;
            }
            props.push(p);
        }
    }
    return props;
}
