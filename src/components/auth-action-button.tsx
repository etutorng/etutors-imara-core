"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface AuthActionButtonProps {
    children: ReactNode;
    dashboardUrl: string;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
}

export function AuthActionButton({
    children,
    dashboardUrl,
    className,
    variant = "default",
    size = "default"
}: AuthActionButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();

    const handleClick = () => {
        if (session) {
            router.push(dashboardUrl);
        } else {
            router.push(`/signup?redirect=${encodeURIComponent(dashboardUrl)}`);
        }
    };

    return (
        <Button
            className={className}
            variant={variant}
            size={size}
            onClick={handleClick}
        >
            {children}
        </Button>
    );
}
