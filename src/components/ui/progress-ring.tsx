import { cn } from "@/lib/utils";

interface ProgressRingProps {
    progress: number; // 0 to 100
    size?: number;
    strokeWidth?: number;
    color?: string; // Tailwind color class, e.g., "text-primary"
    className?: string;
    showValue?: boolean;
}

export function ProgressRing({
    progress,
    size = 60,
    strokeWidth = 4,
    color = "text-primary",
    className,
    showValue = true,
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="rotate-[-90deg]"
            >
                {/* Background Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-muted/20"
                />
                {/* Progress Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={cn("transition-all duration-500 ease-out", color)}
                />
            </svg>
            {showValue && (
                <span className="absolute text-xs font-medium">
                    {Math.round(progress)}%
                </span>
            )}
        </div>
    );
}
