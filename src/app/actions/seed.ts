"use server";

import { db } from "@/db";
import { courses, modules } from "@/db/schema/lms";
import { resources } from "@/db/schema/resources";

export async function seedCourses() {
    try {
        // 1. Create English Course
        const [courseEn] = await db
            .insert(courses)
            .values({
                title: "Introduction to Tailoring",
                description: "Learn how to use a tape measure and basic stitching techniques.",
                category: "Fashion",
                language: "en",
                thumbnailUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",
                isMaster: true,
            })
            .returning();

        // Add Module to English Course
        await db.insert(modules).values({
            courseId: courseEn.id,
            title: "Lesson 1: The Tape Measure",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Test video
            duration: 600,
            order: 1,
        });

        // 2. Create Hausa Course (linked to English course via groupId if we implemented linking logic, but for now just separate)
        // Ideally we should use same groupId.
        const [courseHa] = await db
            .insert(courses)
            .values({
                title: "Gabatarwa zuwa Dinki",
                description: "Koyi yadda ake amfani da tef na awo da dabarun dinki na asali.",
                category: "Fashion",
                language: "ha",
                thumbnailUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",
                groupId: courseEn.groupId, // Link to EN course
            })
            .returning();

        // Add Module to Hausa Course
        await db.insert(modules).values({
            courseId: courseHa.id,
            title: "Darasi na 1: Tef na Awo",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", // Different test video
            duration: 600,
            order: 1,
        });

        // 3. Seed Resources
        await db.insert(resources).values([
            {
                title: "Starting a Business Guide",
                description: "A comprehensive guide to starting your own business in Nigeria.",
                category: "Business",
                format: "pdf",
                url: "https://example.com/guide.pdf",
                language: "en",
                isMaster: true,
            },
            {
                title: "Women's Rights Handbook",
                description: "Know your rights and how to protect them.",
                category: "Legal",
                format: "article",
                content: "This is the content of the handbook...",
                language: "en",
                isMaster: true,
            },
            {
                title: "Tailoring Basics Video",
                description: "Video tutorial for beginners.",
                category: "Fashion",
                format: "link",
                url: "https://youtube.com/watch?v=example",
                language: "en",
                isMaster: true,
            }
        ]);

        // Import resources schema if needed: import { resources } from "@/db/schema/resources";
        // But invalid import in replace block. I need to check if 'resources' is imported.
        // It's likely not. I'll need to update imports too.

        return { success: true, message: "Mock data seeded successfully" };
    } catch (error) {
        console.error("Seeding error:", error);
        return { success: false, error: "Failed to seed data" };
    }
}
