"use client";

import { StatCard } from "@/components/ui/stat-card";
import { GradientCard } from "@/components/ui/gradient-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Button } from "@/components/ui/button";
import {
    Scale,
    GraduationCap,
    Users,
    Award,
    TrendingUp,
    Clock,
    CheckCircle2,
    ArrowRight,
    BookOpen
} from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth/client";
import { useLanguage } from "@/lib/i18n/language-context";

export default function DashboardPage() {
    const { data: session } = useSession();
    const { t } = useLanguage();
    const userName = session?.user?.name || "there";

    // Mock data - replace with real data from API
    const stats = {
        activeCases: 2,
        coursesInProgress: 3,
        badgesEarned: 5,
        mentorMessages: 4,
    };

    const recentActivity = [
        {
            type: "course",
            title: "Digital Literacy Basics",
            progress: 65,
            icon: GraduationCap,
            color: "text-primary",
        },
        {
            type: "legal",
            title: "Workplace Harassment Case",
            status: "In Progress",
            icon: Scale,
            color: "text-accent",
        },
        {
            type: "mentor",
            title: "New message from Mentor Sarah",
            time: "2 hours ago",
            icon: Users,
            color: "text-primary",
        },
    ];

    const quickActions = [
        {
            title: "Submit Legal Request",
            description: "Get free legal aid",
            icon: Scale,
            href: "/legal",
            variant: "primary" as const,
        },
        {
            title: "Browse Courses",
            description: "Learn new skills",
            icon: GraduationCap,
            href: "/lms",
            variant: "accent" as const,
        },
        {
            title: "Find a Mentor",
            description: "Get guidance",
            icon: Users,
            href: "/mentorship",
            variant: "primary" as const,
        },
        {
            title: "Explore Resources",
            description: "Helpful materials",
            icon: BookOpen,
            href: "/resources",
            variant: "accent" as const,
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 md:p-12">
                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            {t("dashboard.welcome")}, {userName}! 👋
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            {t("dashboard.greeting")}
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title={t("dashboard.activeCases")}
                        value={stats.activeCases}
                        icon={Scale}
                        description="Cases being processed"
                        variant="primary"
                    />
                    <StatCard
                        title={t("dashboard.coursesInProgress")}
                        value={stats.coursesInProgress}
                        icon={GraduationCap}
                        description="Keep learning!"
                        variant="accent"
                    />
                    <StatCard
                        title={t("dashboard.badgesEarned")}
                        value={stats.badgesEarned}
                        icon={Award}
                        description="Achievements unlocked"
                        variant="primary"
                    />
                    <StatCard
                        title={t("dashboard.mentorMessages")}
                        value={stats.mentorMessages}
                        icon={Users}
                        description="Unread messages"
                        variant="accent"
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">{t("dashboard.recentActivity")}</h2>
                            <Button variant="ghost" size="sm">
                                {t("dashboard.viewAll")}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {recentActivity.map((activity, index) => {
                                const Icon = activity.icon;
                                return (
                                    <GradientCard key={index} variant="default" className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`rounded-lg bg-muted p-2 ${activity.color}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-sm mb-1">{activity.title}</h3>
                                                {activity.progress !== undefined && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-primary transition-all"
                                                                style={{ width: `${activity.progress}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                            {activity.progress}%
                                                        </span>
                                                    </div>
                                                )}
                                                {activity.status && (
                                                    <p className="text-xs text-muted-foreground">{activity.status}</p>
                                                )}
                                                {activity.time && (
                                                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                                                )}
                                            </div>
                                        </div>
                                    </GradientCard>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">{t("dashboard.quickActions")}</h2>
                        <div className="space-y-3">
                            {quickActions.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <Link key={action.title} href={action.href}>
                                        <GradientCard
                                            variant={action.variant}
                                            className="p-4 cursor-pointer hover:scale-[1.02] transition-transform"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`rounded-lg p-2 ${action.variant === "primary"
                                                    ? "bg-primary/10 text-primary"
                                                    : "bg-accent/10 text-accent"
                                                    }`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-sm">{action.title}</h3>
                                                    <p className="text-xs text-muted-foreground">{action.description}</p>
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </GradientCard>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Progress Overview */}
                <GradientCard variant="primary" className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">{t("dashboard.learningProgress")}</h2>
                            <p className="text-muted-foreground mb-4">
                                {t("dashboard.keepGoing")}
                            </p>
                            <Button asChild>
                                <Link href="/lms">
                                    {t("dashboard.continueLearning")}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <div className="flex gap-8">
                            <div className="text-center">
                                <ProgressRing progress={65} size={80} showValue />
                                <p className="text-xs text-muted-foreground mt-2">{t("dashboard.overallProgress")}</p>
                            </div>
                            <div className="text-center">
                                <ProgressRing progress={45} size={80} color="text-accent" showValue />
                                <p className="text-xs text-muted-foreground mt-2">{t("dashboard.thisWeek")}</p>
                            </div>
                        </div>
                    </div>
                </GradientCard>
            </div>
        </div>
    );
}
