import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/admin/profile/profile-form";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function AdminProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        redirect("/signin");
    }

    // Refetch user to get latest data including phoneNumber
    const currentUser = await db.query.user.findFirst({
        where: eq(user.id, session.user.id)
    });

    if (!currentUser) {
        return <div>User not found</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-sm text-muted-foreground">
                    View and manage your profile information.
                </p>
            </div>
            <ProfileForm user={currentUser} />
        </div>
    );
}
