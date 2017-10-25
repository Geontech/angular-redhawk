/**
 * Interface describing the properties of an SCM file system path (directory or
 * file).
 */
export interface IFileSystemPath {
    read_only: boolean;
    executable: boolean;
    name: string;
    size: number;
}
