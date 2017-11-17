/**
 * Interface describing the properties of an SCM file system path (directory or
 * file).
 */
export interface IFileSystemPath {
    /** True if read-only, false otherwise */
    read_only: boolean;
    /** True if executable, false otherwise */
    executable: boolean;
    /** Name of the path */
    name: string;
    /** Size of the element (bytes) */
    size: number;
}
