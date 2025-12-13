"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

const updateProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phoneNumber: z.string().optional(),
});

export async function updateProfile(data: z.infer<typeof updateProfileSchema>) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        return { error: "Unauthorized" };
    }

    try {
        const validated = updateProfileSchema.parse(data);

        await db.update(user)
            .set({
                name: validated.name,
                phoneNumber: validated.phoneNumber,
            })
            .where(eq(user.id, session.user.id));

        revalidatePath("/admin/profile");

        return { success: true };
    } catch (error) {
        console.error("Failed to update profile:", error);
        return { error: "Failed to update profile" };
    }
}
