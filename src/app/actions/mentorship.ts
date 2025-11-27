"use server";

import { db } from "@/db";
import { mentors, messages } from "@/db/schema";
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
    const allMentors = await db.query.mentors.findMany({
        where: eq(mentors.verified, true),
        with: {
            // Assuming we want to fetch user details too, but we need to define relation in schema first
            // For now, we'll just return mentor records.
        },
    });
    return allMentors;
}
