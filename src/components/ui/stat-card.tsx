import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { GradientCard } from "./gradient-card";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        label: string;
        positive?: boolean;
    };
    variant?: "primary" | "accent" | "default";
    className?: string;
}

export function StatCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    variant = "default",
    className,
}: StatCardProps) {
    return (
        <GradientCard variant={variant} className={cn("relative overflow-hidden", className)}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="mt-2 text-3xl font-bold tracking-tight">{value}</h3>
                    {description && (
                        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                    )}
                </div>
                <div className={cn(
                    "rounded-full p-2",
                    variant === "primary" ? "bg-primary/10 text-primary" :
                        variant === "accent" ? "bg-accent/10 text-accent" :
                            "bg-muted text-muted-foreground"
                )}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center text-xs">
                    <span
                        className={cn(
                            "font-medium",
                            trend.positive ? "text-green-600" : "text-red-600"
                        )}
                    >
                        {trend.positive ? "+" : ""}{trend.value}%
                    </span>
                    <span className="ml-1 text-muted-foreground">{trend.label}</span>
                </div>
            )}
        </GradientCard>
    );
}
