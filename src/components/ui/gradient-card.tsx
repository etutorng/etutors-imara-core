import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GradientCardProps {
    children: ReactNode;
    className?: string;
    variant?: "primary" | "accent" | "default";
    animate?: boolean;
}

export function GradientCard({
    children,
    className,
    variant = "default",
    animate = true
}: GradientCardProps) {
    const variants = {
        default: "bg-card text-card-foreground border-border",
        primary: "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20",
        accent: "bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20",
    };

    return (
        <div
            className={cn(
                "rounded-xl border p-6 shadow-sm transition-all duration-300",
                variants[variant],
                animate && "hover:scale-[1.02] hover:shadow-md",
                className
            )}
        >
            {children}
        </div>
    );
}
