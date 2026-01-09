"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Scale,
    GraduationCap,
    Users,
    BookOpen,
    Menu,
    X,
    LogOut,
    Home,
    Info,
    TrendingUp,
    Github,
    Handshake,
    ChevronDown,
    Shield
} from "lucide-react";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useSession, signOut } from "@/lib/auth/client";
import { useLanguage } from "@/lib/i18n/language-context";
import type { TranslationKey } from "@/lib/i18n/translations";
import { FullLogo } from "@/components/full-logo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = {
    href: string;
    labelKey: TranslationKey;
    icon: any;
    children?: NavItem[];
};

const publicNavItems: NavItem[] = [
    { href: "/", labelKey: "nav.home", icon: Home },
    {
        href: "/about",
        labelKey: "nav.about",
        icon: Info,
        children: [
            { href: "/about", labelKey: "nav.about", icon: Info },
            { href: "/impact", labelKey: "nav.impact", icon: TrendingUp },
            { href: "/partners", labelKey: "nav.partners", icon: Handshake },
            { href: "/open-source", labelKey: "nav.opensource", icon: Github },
        ]
    },
    {
        href: "#",
        labelKey: "nav.support",
        icon: Shield,
        children: [
            { href: "/legal", labelKey: "nav.legal", icon: Scale },
            { href: "/counselling", labelKey: "nav.mentorship", icon: Users },
        ]
    },
    {
        href: "#",
        labelKey: "nav.education",
        icon: GraduationCap,
        children: [
            { href: "/lms", labelKey: "nav.lms", icon: GraduationCap },
            { href: "/scholarship", labelKey: "nav.scholarships", icon: BookOpen },
            { href: "/resources", labelKey: "nav.resources", icon: BookOpen },
        ]
    },
];

const authNavItems: NavItem[] = [
    { href: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
    { href: "/dashboard/legal", labelKey: "nav.legal", icon: Scale },
    { href: "/dashboard/lms", labelKey: "nav.lms", icon: GraduationCap },
    { href: "/dashboard/counselling", labelKey: "nav.mentorship", icon: Users },
    { href: "/resources", labelKey: "nav.resources", icon: BookOpen },
];

export function Navbar({ logoUrl }: { logoUrl?: string | null }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const { data: session } = useSession();
    const { t } = useLanguage();

    const role = (session?.user as any)?.role;
    const isAdmin = role === "SUPER_ADMIN" || role === "ADMIN";

    const navItems = session?.user ? (isAdmin ? [
        { href: "/admin", labelKey: "nav.admin_dashboard", icon: LayoutDashboard },
        // Filter out normal User Dashboard for admins to avoid clutter/confusion,
        // but keep specific functional links if needed.
        ...authNavItems.filter(item => item.href !== "/dashboard")
    ] : authNavItems) : publicNavItems;

    // De-duplicate if admin dashboard is same as dashboard (it's not usually, but good generic practice or manual adjust)
    // admin dashboard is /admin, user is /dashboard.
    const isAuthenticated = !!session?.user;

    const handleSignOut = async () => {
        setIsSigningOut(true);
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = "/";
                },
                onError: () => {
                    setIsSigningOut(false);
                },
            },
        });
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <FullLogo className="h-14 w-48" url={logoUrl} />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (item.children && item.children.some(child => pathname === child.href));

                        if (item.children) {
                            return (
                                <DropdownMenu key={item.labelKey}>
                                    <DropdownMenuTrigger className={cn(
                                        "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary outline-none cursor-pointer",
                                        isActive ? "text-primary" : "text-muted-foreground"
                                    )}>
                                        <Icon className="h-4 w-4" />
                                        {t(item.labelKey)}
                                        <ChevronDown className="h-3 w-3 opacity-50" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        {item.children.map((child) => {
                                            const ChildIcon = child.icon;
                                            return (
                                                <DropdownMenuItem key={child.href} asChild>
                                                    <Link href={child.href} className="flex items-center gap-2 cursor-pointer w-full">
                                                        <ChildIcon className="h-4 w-4 mr-2" />
                                                        {t(child.labelKey)}
                                                    </Link>
                                                </DropdownMenuItem>
                                            )
                                        })}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {t(item.labelKey)}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <LanguageSwitcher />
                    </div>

                    {isAuthenticated ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                            className="hidden md:flex items-center gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            {t("nav.signout")}
                        </Button>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/signin">{t("nav.signin")}</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/signup">{t("nav.signup")}</Link>
                            </Button>
                        </div>
                    )}

                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {/* Simplified mobile menu - flattening parsed items mostly or simple accordion if complex */}
            {isOpen && (
                <div className="md:hidden border-t p-4 space-y-4 bg-background animate-accordion-down overflow-y-auto max-h-[80vh]">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        if (item.children) {
                            return (
                                <div key={item.labelKey} className="space-y-2">
                                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted-foreground">
                                        <Icon className="h-5 w-5" />
                                        {t(item.labelKey)}
                                    </div>
                                    <div className="pl-6 space-y-1 border-l-2 ml-4">
                                        {item.children.map(child => {
                                            const ChildIcon = child.icon;
                                            const isChildActive = pathname === child.href;
                                            return (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className={cn(
                                                        "flex items-center gap-3 rounded-lg p-2 text-sm font-medium transition-colors",
                                                        isChildActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                                                    )}
                                                >
                                                    <ChildIcon className="h-4 w-4" />
                                                    {t(child.labelKey)}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors",
                                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {t(item.labelKey)}
                            </Link>
                        );
                    })}
                    <div className="pt-4 border-t space-y-4">
                        <LanguageSwitcher />
                        {isAuthenticated ? (
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleSignOut}
                                disabled={isSigningOut}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                {t("nav.signout")}
                            </Button>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Button variant="outline" asChild className="w-full">
                                    <Link href="/signin">{t("nav.signin")}</Link>
                                </Button>
                                <Button asChild className="w-full">
                                    <Link href="/signup">{t("nav.signup")}</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
