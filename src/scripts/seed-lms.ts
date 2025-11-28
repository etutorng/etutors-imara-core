import "dotenv/config";
import { db } from "../db";
import { courses, modules } from "../db/schema/lms";

async function seedLMS() {
    try {
        console.log("🌱 Seeding LMS courses...");

        // 1. Create English Course
        const [courseEn] = await db
            .insert(courses)
            .values({
                title: "Introduction to Tailoring",
                description: "Learn how to use a tape measure and basic stitching techniques.",
                category: "Fashion",
                language: "en",
                thumbnailUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",
            })
            .returning();

        console.log(`Created course: ${courseEn.title}`);

        // Add Module to English Course
        await db.insert(modules).values({
            courseId: courseEn.id,
            title: "Lesson 1: The Tape Measure",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Test video
            duration: 600,
            order: 1,
        });

        // 2. Create Hausa Course
        const [courseHa] = await db
            .insert(courses)
            .values({
                title: "Gabatarwa zuwa Dinki",
                description: "Koyi yadda ake amfani da tef na awo da dabarun dinki na asali.",
                category: "Fashion",
                language: "ha",
                thumbnailUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",
            })
            .returning();

        console.log(`Created course: ${courseHa.title}`);

        // Add Module to Hausa Course
        await db.insert(modules).values({
            courseId: courseHa.id,
            title: "Darasi na 1: Tef na Awo",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", // Different test video
            duration: 600,
            order: 1,
        });

        console.log("✅ Mock courses seeded successfully");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding error:", error);
        process.exit(1);
    }
}

seedLMS();
