"use server";

import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, newRole: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        return { error: "Unauthorized: Only Super Admins can update roles." };
    }

    try {
        await db.update(user).set({ role: newRole }).where(eq(user.id, userId));
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Failed to update user role:", error);
        return { error: "Failed to update user role." };
    }
}
