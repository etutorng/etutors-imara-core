"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Scale,
    GraduationCap,
    Users,
    BookOpen,
    Home
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

const navItems = [
    { href: "/dashboard", labelKey: "bottomnav.home" as const, icon: Home },
    { href: "/legal", labelKey: "bottomnav.legal" as const, icon: Scale },
    { href: "/lms", labelKey: "bottomnav.learn" as const, icon: GraduationCap },
    { href: "/mentorship", labelKey: "bottomnav.mentors" as const, icon: Users },
    { href: "/resources", labelKey: "bottomnav.more" as const, icon: BookOpen },
];

export function BottomNav() {
    const pathname = usePathname();
    const { t } = useLanguage();

    // Hide on auth pages and landing page
    if (pathname === "/" || pathname.startsWith("/signin") || pathname.startsWith("/signup")) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden pb-safe">
            <div className="flex h-16 items-center justify-around px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
                            )}
                        >
                            <div className={cn(
                                "p-1 rounded-full transition-all",
                                isActive && "bg-primary/10"
                            )}>
                                <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
                            </div>
                            <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
