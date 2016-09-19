export class Filesystem {
    public files: FilesystemPath[];
    public directories: FilesystemPath[];
    public contents: string;
}

export class FilesystemPath {
    public read_only: boolean;
    public executable: boolean;
    public name: string;
    public size: number;
}