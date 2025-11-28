import "dotenv/config";
import { db } from "../db";
import { mentors } from "../db/schema/mentorship";
import { user } from "../db/schema/auth/user";
import { eq } from "drizzle-orm";
import crypto from "crypto";

async function seedMentors() {
    try {
        console.log("🌱 Seeding mentors...");

        // 1. Ensure a dummy user exists to link mentors to (required by FK)
        let dummyUser = await db.query.user.findFirst({
            where: eq(user.email, "admin@imara.app"),
        });

        if (!dummyUser) {
            console.log("Creating dummy admin user...");
            const [newUser] = await db.insert(user).values({
                id: crypto.randomUUID(),
                name: "Admin",
                email: "admin@imara.app",
                emailVerified: true,
                gender: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning();
            dummyUser = newUser;
        }

        // 2. Insert Mock Mentors
        const mockMentors = [
            {
                userId: dummyUser.id,
                name: "Councillor Aisha",
                expertise: "Health",
                bio: "Experienced community health worker specializing in maternal care and nutrition. Speaks Hausa and English.",
                imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha&backgroundColor=c0aede",
                verified: true,
            },
            {
                userId: dummyUser.id,
                name: "Barrister Ngozi",
                expertise: "Legal",
                bio: "Human rights lawyer dedicated to protecting women's rights and providing legal aid. Speaks Igbo and English.",
                imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ngozi&backgroundColor=b6e3f4",
                verified: true,
            },
            {
                userId: dummyUser.id,
                name: "Madam Folake",
                expertise: "Vocational",
                bio: "Fashion designer and entrepreneur with 15 years of experience training women in tailoring. Speaks Yoruba and Pidgin.",
                imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Folake&backgroundColor=ffdfbf",
                verified: true,
            },
        ];

        for (const mentor of mockMentors) {
            const existing = await db.query.mentors.findFirst({
                where: eq(mentors.name, mentor.name),
            });

            if (!existing) {
                console.log(`Inserting mentor: ${mentor.name}`);
                await db.insert(mentors).values(mentor);
            } else {
                console.log(`Mentor already exists: ${mentor.name}`);
            }
        }

        console.log("✅ Mock mentors seeded successfully");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding error:", error);
        process.exit(1);
    }
}

seedMentors();
