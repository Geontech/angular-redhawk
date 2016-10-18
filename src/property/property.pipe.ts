import { Pipe, PipeTransform } from '@angular/core';

import { Property, PropertySet } from './property';

@Pipe({name: 'property'})
export class ArPropertyPipe implements PipeTransform {
    transform(properties: PropertySet, id: string) {
        return properties.filter(prop => prop.id === id);
    }
}

@Pipe({name: 'properties'})
export class ArPropertiesPipe implements PipeTransform {
    transform(properties: PropertySet, ids: string[]) {
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
