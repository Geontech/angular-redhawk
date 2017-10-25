import { InjectionToken } from '@angular/core';

/**
 * REST Python's location information.
 */
export interface IRestPythonConfig {
    /** Host name or IP of the server hosting REST-Python */
    host?: string;
    /** Port number used by REST-Python */
    port?: number;
    /** API URL if different from the default */
    apiUrl?: string;
}

/**
 * Pre-configure the REST-Python service by adding this to your application's
 * providers
 */
export const REST_PYTHON_CONFIG = new InjectionToken<IRestPythonConfig>('REST_PYTHON_CONFIG');
