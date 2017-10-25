import { NgModule } from '@angular/core';
import { RestPythonModule } from '../../rest-python/rest-python.module';

// Submodules
import { IdmEventModule } from './idm/idm-event.module';
import { OdmEventModule } from './odm/odm-event.module';

// Exports
export * from './idm/idm-event.module';
export * from './odm/odm-event.module';
export * from './generic/index';

/**
 * The Event Channel Module represents all traffic that can occur on a REDHAWK
 * Event Channel including ODM, IDM, and Messages.
 */
@NgModule({
    imports: [
        RestPythonModule,
        IdmEventModule,
        OdmEventModule
    ],
    exports: [
        IdmEventModule,
        OdmEventModule
    ]
})
export class EventChannelModule {}