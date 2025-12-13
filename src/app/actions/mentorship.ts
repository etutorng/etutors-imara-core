"use server";

import { db } from "@/db";
import { mentors, messages, user } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { and, eq, or } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

const sendMessageSchema = z.object({
    receiverId: z.string(),
    content: z.string().min(1),
});

export async function sendMessage(data: z.infer<typeof sendMessageSchema>) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return { error: "Unauthorized" };
    }

    await db.insert(messages).values({
        senderId: session.user.id,
        receiverId: data.receiverId,
        content: data.content,
    });

    return { success: true };
}

export async function getMessages(otherUserId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return [];
    }

    const conversation = await db.query.messages.findMany({
        where: or(
            and(eq(messages.senderId, session.user.id), eq(messages.receiverId, otherUserId)),
            and(eq(messages.senderId, otherUserId), eq(messages.receiverId, session.user.id))
        ),
        orderBy: (messages, { asc }) => [asc(messages.createdAt)],
    });
    return conversation;
}

export async function getMentors() {
    const counsellors = await db.query.user.findMany({
        where: eq(user.role, "COUNSELLOR"),
        columns: {
            id: true,
            name: true,
            image: true,
        },
    });

    // Map to Mentor type expected by UI
    return counsellors.map(c => ({
        id: c.id,
        name: c.name,
        imageUrl: c.image,
        expertise: "Counseling", // Default for now, as User schema doesn't have expertise
        bio: "Verified Counsellor on Imara", // Default bio
        verified: true,
    }));
}
