import { ISerializable } from '../shared/serializable';

export class FileSystem implements ISerializable<FileSystem> {
    files: IFileSystemPath[];
    directories: IFileSystemPath[];
    contents: string;

    deserialize(input: any) {
        this.files = input.files;
        this.directories = input.directories;
        this.contents = input.contents;
        return this;
    }
}

export interface IFileSystemPath {
    read_only: boolean;
    executable: boolean;
    name: string;
    size: number;
}
