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
    Handshake
} from "lucide-react";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useSession, signOut } from "@/lib/auth/client";
import { useLanguage } from "@/lib/i18n/language-context";
import type { TranslationKey } from "@/lib/i18n/translations";
import { FullLogo } from "@/components/full-logo";

const publicNavItems: Array<{ href: string; labelKey: TranslationKey; icon: any }> = [
    { href: "/", labelKey: "nav.home", icon: Home },
    { href: "/about", labelKey: "nav.about", icon: Info },
    { href: "/impact", labelKey: "nav.impact", icon: TrendingUp },
    { href: "/open-source", labelKey: "nav.opensource", icon: Github },
    { href: "/partners", labelKey: "nav.partners", icon: Handshake },
];

const authNavItems: Array<{ href: string; labelKey: TranslationKey; icon: any }> = [
    { href: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
    { href: "/legal", labelKey: "nav.legal", icon: Scale },
    { href: "/lms", labelKey: "nav.lms", icon: GraduationCap },
    { href: "/mentorship", labelKey: "nav.mentorship", icon: Users },
    { href: "/resources", labelKey: "nav.resources", icon: BookOpen },
];

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const { data: session } = useSession();
    const { t } = useLanguage();

    const navItems = session?.user ? authNavItems : publicNavItems;
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
                    <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
                        <FullLogo className="h-14 w-48" />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
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
            {isOpen && (
                <div className="md:hidden border-t p-4 space-y-4 bg-background animate-accordion-down">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
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
