export class FileSystem {
    public files: FileSystemPath[];
    public directories: FileSystemPath[];
    public contents: string;
}

export class FileSystemPath {
    public read_only: boolean;
    public executable: boolean;
    public name: string;
    public size: number;
}