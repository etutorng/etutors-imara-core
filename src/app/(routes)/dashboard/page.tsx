import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/signin");
    }

    const role = (session.user as any).role;
    const privilegedRoles = ["SUPER_ADMIN", "CONTENT_EDITOR", "LEGAL_PARTNER", "COUNSELLOR"];

    if (role && privilegedRoles.includes(role)) {
        redirect("/admin/dashboard");
    }

    return <DashboardClient />;
}
