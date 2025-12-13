import "dotenv/config";
import { db } from "../db";
import { resources } from "../db/schema/resources";

async function seedResources() {
    try {
        console.log("🌱 Seeding resources...");

        // Clear existing resources
        await db.delete(resources);
        console.log("🗑️ Cleared existing resources");

        const mockResources = [
            {
                title: "5 Signs of Infection",
                category: "Health",
                format: "article",
                url: "https://www.unicef.org/nigeria/health",
                description: "Learn the 5 key signs of infection to watch out for.",
                language: "en",
                isMaster: true,
            },
            {
                title: "Alamomi 5 na Kamuwa da Cutar",
                category: "Health",
                format: "article",
                url: "https://www.unicef.org/nigeria/health",
                description: "Koyi manyan alamomi 5 na kamuwa da cuta da za a kula da su.",
                language: "ha",
                isMaster: false,
            },
            {
                title: "Know Your Rights: Police Arrests",
                category: "Legal",
                format: "pdf",
                url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                description: "Essential guide on what to do if you are arrested by the police.",
                language: "en",
                isMaster: true,
            },
            {
                title: "Know Your Rights: If Police Hold You",
                category: "Legal",
                format: "pdf",
                url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                description: "Wetin you suppose do if police hold you.",
                language: "pcm",
                isMaster: false,
            },
            {
                title: "National Human Rights Commission",
                category: "Legal",
                format: "link",
                url: "https://www.nhrc.gov.ng/",
                description: "Official website of the National Human Rights Commission of Nigeria.",
                language: "en",
                isMaster: true,
            },
            {
                title: "Emergency Contacts Directory",
                category: "Safety",
                format: "link",
                url: "https://www.redcross.org.ng/",
                description: "A directory of emergency contacts for immediate assistance.",
                language: "en",
                isMaster: true,
            },
        ];

        for (const res of mockResources) {
            await db.insert(resources).values(res);
            console.log(`Inserted: ${res.title}`);
        }

        console.log("✅ Mock resources seeded successfully");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding error:", error);
        process.exit(1);
    }
}

seedResources();
