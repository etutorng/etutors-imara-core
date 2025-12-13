import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { ArrowUpRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAdminDashboardStats, getRecentSystemActivity } from "@/app/actions/admin-dashboard";
import { formatDistanceToNow } from "date-fns";

export default async function AdminDashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/signin");
    }

    const role = (session.user as any).role;
    const stats = await getAdminDashboardStats();
    const recentActivity = await getRecentSystemActivity();

    // Default stats if null
    const safeStats = stats || {
        totalUsers: 0,
        activeCases: 0,
        totalCourses: 0,
        pendingApprovals: 0,
        missingTranslations: 0,
        myActiveCases: 0,
        pendingRequests: 0,
        resolvedCases: 0,
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                    <p className="text-muted-foreground">Welcome back, {session.user.name}. Here is what's happening today.</p>
                </div>
                <div className="flex gap-2">
                    {(role === "SUPER_ADMIN" || role === "CONTENT_EDITOR") && (
                        <Button asChild size="sm">
                            <Link href="/admin/content">
                                <Plus className="mr-2 h-4 w-4" />
                                New Content
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            <DashboardStats role={role} stats={safeStats} />

            {/* Recent Activity Section */}
            <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="tracking-tight text-sm font-medium">Recent System Activity</h3>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ArrowUpRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="p-6 pt-0">
                    <div className="space-y-4">
                        {recentActivity.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No recent activity.</p>
                        ) : (
                            recentActivity.map((item, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{item.user}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.action}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium text-xs text-muted-foreground">
                                        {item.date ? formatDistanceToNow(new Date(item.date), { addSuffix: true }) : ""}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
