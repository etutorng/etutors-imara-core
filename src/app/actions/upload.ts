"use server";

import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function uploadFile(formData: FormData, folder: string = "misc") {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // Check for admin role (Super Admin or relevant implementation role)
    // For now, strict check like settings
    const role = (session?.user as any)?.role;
    const isAuthorized = role === "SUPER_ADMIN" || role === "CONTENT_EDITOR" || role === "LEGAL_PARTNER"; // Broaden slightly for CMS

    if (!session || !isAuthorized) {
        return { error: "Unauthorized" };
    }

    const file = formData.get("file") as File;
    if (!file) {
        return { error: "No file provided" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    // Sanitize original name
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${originalName}`;

    // Ensure folder path is safe (basic check)
    const safeFolder = folder.replace(/[^a-zA-Z0-9-_]/g, "");
    const uploadDir = join(process.cwd(), "public", "uploads", safeFolder);

    try {
        await mkdir(uploadDir, { recursive: true });
        await writeFile(join(uploadDir, filename), buffer);

        // Return the public URL
        return { success: true, url: `/uploads/${safeFolder}/${filename}` };
    } catch (error) {
        console.error("Upload failed:", error);
        return { error: "Upload failed" };
    }
}
