import {
    Directive,
    OnInit,
    OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { RedhawkService }        from './redhawk.service';
import { Redhawk } from './redhawk';

@Directive({
    selector: '[arRedhawk]',
    providers: [ RedhawkService ]
})
export class ArRedhawk implements OnInit, OnDestroy {
    public model: Redhawk = new Redhawk();

    private subscription: Subscription;

    constructor(private service: RedhawkService) { }

    ngOnInit() {
        this.service.uniqueId = 'Angular-REDHAWK';
        this.subscription = this.service.model.subscribe(it => this.model = it);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
