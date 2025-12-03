"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    FileText,
    Scale,
    Settings,
} from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    role: string;
}

export function SidebarNav({ className, role, ...props }: SidebarNavProps) {
    const pathname = usePathname();

    const routes = [
        {
            href: "/admin/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            active: pathname === "/admin" || pathname === "/admin/dashboard",
            roles: ["SUPER_ADMIN", "CONTENT_EDITOR", "LEGAL_PARTNER", "COUNSELLOR"],
        },
        {
            href: "/admin/users",
            label: "User Management",
            icon: Users,
            active: pathname === "/admin/users",
            roles: ["SUPER_ADMIN"],
        },
        {
            href: "/admin/content",
            label: "Content CMS",
            icon: FileText,
            active: pathname === "/admin/content",
            roles: ["SUPER_ADMIN", "CONTENT_EDITOR"],
        },
        {
            href: "/admin/legal",
            label: "Legal Cases",
            icon: Scale,
            active: pathname === "/admin/legal",
            roles: ["SUPER_ADMIN", "LEGAL_PARTNER"],
        },
        {
            href: "/admin/settings",
            label: "Settings",
            icon: Settings,
            active: pathname === "/admin/settings",
            roles: ["SUPER_ADMIN"],
        },
    ];

    const filteredRoutes = routes.filter((route) => route.roles.includes(role));

    return (
        <nav
            className={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)}
            {...props}
        >
            {filteredRoutes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        "justify-start text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 px-3 py-2 rounded-md",
                        route.active
                            ? "bg-muted text-primary"
                            : "text-muted-foreground hover:bg-muted"
                    )}
                >
                    <route.icon className="h-4 w-4" />
                    {route.label}
                </Link>
            ))}
        </nav>
    );
}
