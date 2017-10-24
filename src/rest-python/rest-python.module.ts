import {
    NgModule,
    ModuleWithProviders,
    Inject,
    InjectionToken,
    SkipSelf,
    Optional
} from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonService } from './rest-python.service';

/** Exports */
export { RestPythonService } from './rest-python.service';
export interface IRestPythonConfig {
    host?: string;
    port?: number;
    apiUrl?: string;
}

// Tokens for config and guard
const REST_PYTHON_CONFIG = new InjectionToken<IRestPythonConfig>('REST_PYTHON_CONFIG');
const REST_PYTHON_GUARD = new InjectionToken<void>('REST_PYTHON_GUARD');

/**
 * The REST-Python Module provides the RestPythonService to the application, which
 * is the primary back-end for communicating with the REST-Python REDHAWK server.
 */
@NgModule({
    imports: [ HttpModule ]
})
export class RestPythonModule {
    /**
     * At your top module, import RestPythonModule.forRoot() with the destination
     * of your REST-Python server to configure this interface.
     */
    static forRoot(config?: IRestPythonConfig): ModuleWithProviders {
        return {
            ngModule:  RestPythonModule,
            providers: [
                {
                    provide:     REST_PYTHON_CONFIG,
                    useValue:    config ? config : {}
                },
                {
                    provide:     RestPythonService,
                    useFactory:  configureRestPythonService,
                    deps:        [ REST_PYTHON_CONFIG ]
                },
                {
                    provide:     REST_PYTHON_GUARD,
                    useFactory:  provideRestPythonGuard,
                    deps:        [ [ RestPythonService, new Optional(), new SkipSelf() ] ]
                }
            ]
        }
    }

    /**
     * Any model depending directly on the RestPythonService may import forChild().
     * For example, the various services and directives in Angular-REDHAWK that
     * provide specific access to the REST server.
     */
    static forChild(): ModuleWithProviders {
        return { ngModule: RestPythonModule, providers: [] };
    }

    constructor(@Optional() @Inject(REST_PYTHON_GUARD) guard: any, @Optional() rpservice: RestPythonService) {}
}

/** Provides a guard against accidentally instantiating two copies of the service. */
export function provideRestPythonGuard(rpservice: RestPythonService): any {
    if (rpservice) {
        throw new Error('RestPythonModule.forRoot() called twice.  Lazy-loaded modules should use forChild() instead.');
    }
    return 'guarded';
}

/** Provides the configured instance of the RestPythonService to the application */
export function configureRestPythonService(config: IRestPythonConfig): RestPythonService {
    // Defaults
    let host = config.host || window.location.hostname;
    let port = config.port || +window.location.port; // converts to number
    let apiUrl = config.apiUrl || '/redhawk/rest';
    const s = new RestPythonService(host, port, apiUrl);
    return s;
}