/**
 * Filter a ResourceRef listing using either id or name.
 */
export interface IRefFilter {
    /** The ID of the ResourceRef */
    id?:   string;
    /** The Name of the ResourceRef */
    name?: string;
}
