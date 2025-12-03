"use client";

import { StatCard } from "@/components/ui/stat-card";
import { Users, FileText, Scale, Video, AlertCircle, CheckCircle, Eye, Globe } from "lucide-react";

interface DashboardStatsProps {
    role: string;
}

export function DashboardStats({ role }: DashboardStatsProps) {
    if (role === "SUPER_ADMIN") {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Users"
                    value="1,234"
                    icon={Users}
                    description="Active users on the platform"
                    trend={{ value: 12, label: "from last month", positive: true }}
                    variant="primary"
                />
                <StatCard
                    title="Active Legal Cases"
                    value="24"
                    icon={Scale}
                    description="Cases currently in progress"
                    variant="accent"
                />
                <StatCard
                    title="Total Videos"
                    value="156"
                    icon={Video}
                    description="Educational content uploaded"
                />
                <StatCard
                    title="Pending Approvals"
                    value="7"
                    icon={AlertCircle}
                    description="Content waiting for review"
                    variant="default"
                />
            </div>
        );
    }

    if (role === "CONTENT_EDITOR") {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Total Courses Uploaded"
                    value="45"
                    icon={FileText}
                    description="Courses you have created"
                    variant="primary"
                />
                <StatCard
                    title="Missing Translations"
                    value="12"
                    icon={Globe}
                    description="Content needing translation"
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
                    title="My Active Cases"
                    value="8"
                    icon={Scale}
                    description="Cases assigned to you"
                    variant="primary"
                />
                <StatCard
                    title="Pending Requests"
                    value="3"
                    icon={AlertCircle}
                    description="New legal assistance requests"
                    variant="accent"
                />
                <StatCard
                    title="Resolved Cases"
                    value="156"
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
