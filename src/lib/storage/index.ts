import { S3Storage } from "./s3";
import { LocalStorage } from "./local";
import { StorageProvider } from "./types";

const provider: StorageProvider = process.env.STORAGE_PROVIDER === "s3"
    ? new S3Storage()
    : new LocalStorage();

export const storage = provider;
