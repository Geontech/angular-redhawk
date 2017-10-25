import { ISerializable } from '../serialization/index';
import { IFileSystemPath } from './file-system-path';

/**
 * Serializable REDHAWK Model of the SCA FileSystem interface.
 */
export class FileSystem implements ISerializable<FileSystem> {
    files:       Array<IFileSystemPath>;
    directories: Array<IFileSystemPath>;
    contents:    string;

    constructor() {
        this.files = [];
        this.directories = [];
    }

    deserialize(input: any) {
        this.files = input.files;
        this.directories = input.directories;
        this.contents = input.contents;
        return this;
    }
}
