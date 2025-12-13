import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { getCounsellingQueue } from "@/app/actions/counselling";
import { CounsellorDashboard } from "@/components/admin/counselling/counsellor-dashboard";
import { redirect } from "next/navigation";

export default async function AdminCounsellingPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role === "USER") {
        // Basic RBAC check, middleware handles redirection mostly but good to preserve
        redirect("/unauthorized");
    }

    const queueData = await getCounsellingQueue();

    if (queueData.error) {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold text-destructive">Error</h1>
                <p>{queueData.error}</p>
            </div>
        );
    }

    // Default empty if structure differs
    const queue = {
        pending: queueData.pending || [],
        active: queueData.active || []
    };

    return (
        <div className="p-6 h-screen flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Counselling Dashboard</h1>
                <p className="text-muted-foreground">Manage support requests and active sessions.</p>
            </div>

            <div className="flex-1 min-h-0">
                <CounsellorDashboard queue={queue} currentUser={session.user} />
            </div>
        </div>
    );
}
