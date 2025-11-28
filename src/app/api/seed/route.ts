import { db } from "@/db";
import { courses, modules } from "@/db/schema/lms";
import { NextResponse } from "next/server";

export async function GET() {
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

        // Add Module to Hausa Course
        await db.insert(modules).values({
            courseId: courseHa.id,
            title: "Darasi na 1: Tef na Awo",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", // Different test video
            duration: 600,
            order: 1,
        });

        return NextResponse.json({
            success: true,
            message: "Mock courses seeded successfully",
            data: {
                en: courseEn,
                ha: courseHa,
            },
        });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to seed data" },
            { status: 500 }
        );
    }
}
