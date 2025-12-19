"use server";

import { db } from "@/db";
import { systemSettings } from "@/db/schema/settings";
import { auth } from "@/lib/auth/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function uploadLogo(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        return { error: "Unauthorized" };
    }

    const file = formData.get("file") as File;
    if (!file) {
        return { error: "No file provided" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = "logo-" + uniqueSuffix + "." + file.name.split(".").pop();
    const uploadDir = join(process.cwd(), "public", "uploads");
    
    try {
        await mkdir(uploadDir, { recursive: true });
        await writeFile(join(uploadDir, filename), buffer);
        return { success: true, url: `/uploads/${filename}` };
    } catch (error) {
        console.error("Upload failed:", error);
        return { error: "Upload failed" };
    }
}

export async function getSystemSettings() {
    try {
        const settings = await db.query.systemSettings.findFirst();

        if (!settings) {
            // Create default settings if none exist
            const [newSettings] = await db.insert(systemSettings).values({}).returning();
            return newSettings;
        }

        return settings;
    } catch (error) {
        // Return default settings if database is unavailable (e.g., during build)
        console.warn("Database unavailable, using default settings:", error);
        return {
            id: "default",
            siteName: "Imara",
            supportEmail: "support@imara.com",
            maintenanceMode: false,
            allowRegistration: true,
            siteLogoUrl: "/imara-logo.png",
            updatedAt: new Date(),
        };
    }
}

export async function updateSystemSettings(data: {
    siteName: string;
    supportEmail: string;
    maintenanceMode: boolean;
    allowRegistration: boolean;
    siteLogoUrl?: string; // Optional
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        // We assume there's only one row, but to be safe we fetch the ID first or update all (since it's a singleton table concept)
        // Better to get the ID from getSystemSettings
        const currentSettings = await getSystemSettings();

        await db.update(systemSettings)
            .set({
                siteName: data.siteName,
                supportEmail: data.supportEmail,
                maintenanceMode: data.maintenanceMode,
                allowRegistration: data.allowRegistration,
                siteLogoUrl: data.siteLogoUrl !== undefined ? data.siteLogoUrl : currentSettings.siteLogoUrl,
                updatedAt: new Date(),
            })
            .where(eq(systemSettings.id, currentSettings.id));

        revalidatePath("/admin/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to update settings:", error);
        return { error: "Failed to update settings" };
    }
}
