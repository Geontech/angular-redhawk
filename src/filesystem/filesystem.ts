export class FileSystem {
    files: FileSystemPath[];
    directories: FileSystemPath[];
    contents: string;
}

export interface FileSystemPath {
    read_only: boolean;
    executable: boolean;
    name: string;
    size: number;
}
