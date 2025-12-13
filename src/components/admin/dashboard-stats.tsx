"use client";

import { StatCard } from "@/components/ui/stat-card";
import { Users, FileText, Scale, Video, AlertCircle, CheckCircle, Eye, Globe } from "lucide-react";

interface DashboardStatsProps {
    role: string;
    stats: {
        totalUsers: number;
        activeCases: number;
        totalCourses: number;
        pendingApprovals: number;
        missingTranslations: number;
        myActiveCases: number;
        pendingRequests: number;
        resolvedCases: number;
    };
}

export function DashboardStats({ role, stats }: DashboardStatsProps) {
    if (role === "SUPER_ADMIN") {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers.toString()}
                    icon={Users}
                    description="Active users on the platform"
                    trend={{ value: 12, label: "from last month", positive: true }}
                    variant="primary"
                />
                <StatCard
                    title="Active Legal Cases"
                    value={stats.activeCases.toString()}
                    icon={Scale}
                    description="Cases currently in progress"
                    variant="accent"
                />
                <StatCard
                    title="Total Courses"
                    value={stats.totalCourses.toString()}
                    icon={Video}
                    description="Master courses available"
                />
                <StatCard
                    title="Pending Tickets"
                    value={stats.pendingApprovals.toString()}
                    icon={AlertCircle}
                    description="Waiting coverage/action"
                    variant="default"
                />
            </div>
        );
    }

    if (role === "CONTENT_EDITOR") {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Total Courses"
                    value={stats.totalCourses.toString()}
                    icon={FileText}
                    description="Master courses available"
                    variant="primary"
                />
                <StatCard
                    title="Total Resources"
                    value={stats.activeCases.toString()} // Reusing field
                    icon={Globe}
                    description="Resources in library"
                    variant="accent"
                />
                <StatCard
                    title="Most Viewed Video"
                    value="2.4k"
                    icon={Eye}
                    description="Views on 'Women Rights 101'"
                />
            </div>
        );
    }

    if (role === "LEGAL_PARTNER") {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Active Cases"
                    value={stats.myActiveCases.toString()}
                    icon={Scale}
                    description="Total active cases"
                    variant="primary"
                />
                <StatCard
                    title="Pending Requests"
                    value={stats.pendingRequests.toString()}
                    icon={AlertCircle}
                    description="New legal assistance requests"
                    variant="accent"
                />
                <StatCard
                    title="Resolved Cases"
                    value={stats.resolvedCases.toString()}
                    icon={CheckCircle}
                    description="Total cases closed"
                />
            </div>
        );
    }

    return (
        <div className="p-4 rounded-md bg-muted">
            <p className="text-muted-foreground">Welcome to the dashboard.</p>
        </div>
    );
}
