export interface StorageProvider {
    uploadFile(file: File, path: string): Promise<string>; // Returns public URL
    deleteFile(path: string): Promise<void>;
}
