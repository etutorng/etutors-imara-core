"use server";

import { db } from "@/db";
import { systemSettings } from "@/db/schema/settings";
import { auth } from "@/lib/auth/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getSystemSettings() {
    const settings = await db.query.systemSettings.findFirst();

    if (!settings) {
        // Create default settings if none exist
        const [newSettings] = await db.insert(systemSettings).values({}).returning();
        return newSettings;
    }

    return settings;
}

export async function updateSystemSettings(data: {
    siteName: string;
    supportEmail: string;
    maintenanceMode: boolean;
    allowRegistration: boolean;
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
