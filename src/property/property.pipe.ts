import { Pipe, PipeTransform } from '@angular/core';

import { Property, PropertySet } from './property';

@Pipe({name: 'arProperty'})
export class ArPropertyPipe implements PipeTransform {
    transform(properties: PropertySet, id: string): Property {
        let p = properties.filter(prop => prop.id === id)[0] || undefined;
        return p;
    }
}

@Pipe({name: 'arProperties'})
export class ArPropertiesPipe implements PipeTransform {
    transform(properties: PropertySet, ids: string[]): PropertySet {
        let set: PropertySet = [];
        properties.filter(prop => {
            for (let id in ids) {
                if (prop.id === id) {
                    set.push(prop);
                }
            }
        });
        return set;
    }
}
