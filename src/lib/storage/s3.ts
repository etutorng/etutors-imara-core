import { StorageProvider } from "./types";

export class S3Storage implements StorageProvider {
    async uploadFile(file: File, path: string): Promise<string> {
        // TODO: Implement S3 upload
        console.warn("S3 Storage not implemented yet. Using mock.");
        return `https://s3.example.com/${path}`;
    }

    async deleteFile(path: string): Promise<void> {
        // TODO: Implement S3 delete
        console.warn("S3 Storage not implemented yet.");
    }
}
