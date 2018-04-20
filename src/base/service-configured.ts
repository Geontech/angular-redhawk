/**
 * This interface is for indicating the nature of a service's configuration
 * updates (configured$ observable).
 */
export interface IServiceConfigured {
    /** TRUE if a model was successfully retrieved, FALSE otherwise */
    success: boolean;
    /** TRUE if the change related to this reconfiguration was a URI (endpoint) change, FALSE otherwise */
    uriChanged: boolean;
}
