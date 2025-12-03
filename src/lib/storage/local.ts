import { StorageProvider } from "./types";
import fs from "fs/promises";
import path from "path";

export class LocalStorage implements StorageProvider {
    private uploadDir = path.join(process.cwd(), "public", "uploads");

    async uploadFile(file: File, filePath: string): Promise<string> {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fullPath = path.join(this.uploadDir, filePath);

        // Ensure directory exists
        await fs.mkdir(path.dirname(fullPath), { recursive: true });

        await fs.writeFile(fullPath, buffer);

        // Return public URL
        return `/uploads/${filePath}`;
    }

    async deleteFile(filePath: string): Promise<void> {
        const fullPath = path.join(this.uploadDir, filePath);
        try {
            await fs.unlink(fullPath);
        } catch (error) {
            console.error(`Failed to delete file ${fullPath}:`, error);
        }
    }
}
