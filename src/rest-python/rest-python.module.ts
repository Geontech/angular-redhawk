import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RestPythonService } from './rest-python.service';

/** Exports */
export { RestPythonService } from './rest-python.service';
export {
    IRestPythonConfig,
    REST_PYTHON_CONFIG
} from './rest-python-config';

/**
 * The REST-Python Module provides the RestPythonService to the application, which
 * is the primary back-end for communicating with the REST-Python REDHAWK server.
 */
@NgModule({
    imports:   [ HttpModule ],
    providers: [ RestPythonService ]
})
export class RestPythonModule {}
