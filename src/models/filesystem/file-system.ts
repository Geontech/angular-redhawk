import { ISerializable } from '../serialization/index';
import { IFileSystemPath } from './file-system-path';

/**
 * Serializable REDHAWK Model of the SCA FileSystem interface.
 */
export class FileSystem implements ISerializable<FileSystem> {
    /** Files in the path */
    files:       Array<IFileSystemPath>;
    /** Directories in the path */
    directories: Array<IFileSystemPath>;
    /** Contents of the path (if it's a file) */
    contents:    string;

    /** Constructor */
    constructor() {
        this.files = [];
        this.directories = [];
    }

    /** Deserializes a JSON object into this class */
    deserialize(input: any) {
        this.files = input.files;
        this.directories = input.directories;
        this.contents = input.contents;
        return this;
    }
}
