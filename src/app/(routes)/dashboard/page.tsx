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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth/client";
import { useLanguage } from "@/lib/i18n/language-context";
import { getUserDashboardStats } from "@/app/actions/dashboard";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
    const { data: session, isPending } = useSession();
    const { t } = useLanguage();
    const router = useRouter();
    const userName = session?.user?.name || "there";

    const [stats, setStats] = useState({
        activeCases: 0,
        coursesInProgress: 0,
        badgesEarned: 0,
        mentorMessages: 0,
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/signin");
        } else if (session?.user) {
            // Check for privileged roles and redirect to Admin Dashboard
            const role = (session.user as any).role;
            const privilegedRoles = ["SUPER_ADMIN", "CONTENT_EDITOR", "LEGAL_PARTNER", "COUNSELLOR"];

            if (role && privilegedRoles.includes(role)) {
                router.push("/admin/dashboard");
            }
        }
    }, [session, isPending, router]);

    const [learningProgress, setLearningProgress] = useState({
        overall: 0,
        thisWeek: 0
    });

    useEffect(() => {
        async function loadStats() {
            if (session?.user) {
                try {
                    const data = await getUserDashboardStats();
                    if (data) {
                        setStats(data.stats);
                        setRecentActivity(data.recentActivity);
                        if (data.learningProgress) {
                            setLearningProgress(data.learningProgress);
                        }
                    }
                } catch (error) {
                    console.error("Failed to load dashboard stats:", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        loadStats();
    }, [session]);

    if (isPending || !session) {
        return null; // Or a loading spinner
    }

    // ... existing quickActions code ...
    const quickActions = [
        {
            title: "Submit Legal Request",
            description: "Get free legal aid",
            icon: Scale,
            href: "/dashboard/legal",
            variant: "primary" as const,
        },
        {
            title: "Browse Courses",
            description: "Learn new skills",
            icon: GraduationCap,
            href: "/dashboard/lms",
            variant: "accent" as const,
        },
        {
            title: "Find a Mentor",
            description: "Get guidance",
            icon: Users,
            href: "/dashboard/counselling",
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

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "Scale": return Scale;
            case "GraduationCap": return GraduationCap;
            case "Users": return Users;
            default: return TrendingUp;
        }
    };

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
                        value={loading ? "-" : stats.activeCases}
                        icon={Scale}
                        description="Cases being processed"
                        variant="primary"
                    />
                    <StatCard
                        title={t("dashboard.coursesInProgress")}
                        value={loading ? "-" : stats.coursesInProgress}
                        icon={GraduationCap}
                        description="Keep learning!"
                        variant="accent"
                    />
                    <StatCard
                        title={t("dashboard.badgesEarned")}
                        value={loading ? "-" : stats.badgesEarned}
                        icon={Award}
                        description="Achievements unlocked"
                        variant="primary"
                    />
                    <StatCard
                        title={t("dashboard.mentorMessages")}
                        value={loading ? "-" : stats.mentorMessages}
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
                        </div>

                        <div className="space-y-3">
                            {loading ? (
                                <p className="text-muted-foreground">Loading activity...</p>
                            ) : recentActivity.length === 0 ? (
                                <p className="text-muted-foreground">No recent activity.</p>
                            ) : (
                                recentActivity.map((activity, index) => {
                                    const Icon = getIcon(activity.icon);
                                    return (
                                        <GradientCard key={index} variant="default" className="p-4">
                                            <div className="flex items-start gap-4">
                                                <div className={`rounded-lg bg-muted p-2 ${activity.color}`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-sm mb-1">{activity.title}</h3>
                                                    {activity.subtitle && (
                                                        <p className="text-xs text-muted-foreground mb-1">{activity.subtitle}</p>
                                                    )}
                                                    {activity.status && (
                                                        <p className="text-xs font-medium">{activity.status}</p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </div>
                                        </GradientCard>
                                    );
                                })
                            )}
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
                                <Link href="/dashboard/lms">
                                    {t("dashboard.continueLearning")}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <div className="flex gap-8">
                            <div className="text-center">
                                <ProgressRing progress={learningProgress.overall} size={80} showValue />
                                <p className="text-xs text-muted-foreground mt-2">{t("dashboard.overallProgress")}</p>
                            </div>
                            <div className="text-center">
                                <ProgressRing progress={learningProgress.thisWeek} size={80} color="text-accent" showValue />
                                <p className="text-xs text-muted-foreground mt-2">{t("dashboard.thisWeek")}</p>
                            </div>
                        </div>
                    </div>
                </GradientCard>
            </div>
        </div>
    );
}
