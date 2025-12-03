import "dotenv/config";
import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { eq } from "drizzle-orm";

async function main() {
    console.log("🌱 Seeding RBAC users...");

    const roles = [
        "SUPER_ADMIN",
        "CONTENT_EDITOR",
        "LEGAL_PARTNER",
        "COUNSELLOR",
        "USER",
    ] as const;

    const password = "password123";

    for (const role of roles) {
        const email = `${role.toLowerCase().replace("_", ".")}@example.com`;

        // Check if user exists
        const existingUser = await db.query.user.findFirst({
            where: (user, { eq }) => eq(user.email, email),
        });

        if (existingUser) {
            console.log(`🗑️ Deleting existing user: ${email}`);
            await db.delete(user).where(eq(user.email, email));
        }

        // Create user with password using Better-Auth API
        try {
            await auth.api.signUpEmail({
                body: {
                    email,
                    password,
                    name: role.replace("_", " "),
                    role: role, // This will be handled by the additionalFields config or we might need to update it manually if not exposed
                    gender: false,
                }
            });

            // Verify role update (in case signUpEmail didn't set it because it's not in the input schema by default)
            await db.update(user).set({ role: role }).where(eq(user.email, email));

            console.log(`✅ Created user: ${email} (${role})`);
        } catch (error) {
            console.error(`❌ Failed to create user ${email}:`, error);
        }
    }

    console.log("🎉 RBAC seeding complete!");
    console.log(`🔑 Password for all users: ${password}`);
    process.exit(0);
}

main().catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});
