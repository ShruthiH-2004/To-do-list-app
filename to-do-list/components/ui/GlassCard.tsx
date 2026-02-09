import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function GlassCard({ className, children, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md shadow-xl dark:border-white/10 dark:bg-black/20",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/10 to-transparent opacity-20 dark:from-white/5" />
            {children}
        </div>
    );
}
