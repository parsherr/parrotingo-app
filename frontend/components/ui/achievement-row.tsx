"use client"

import { motion } from "framer-motion"
import { Check, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface AchievementRowProps {
    name: string
    description: string
    icon: React.ReactNode
    status: "completed" | "claim" | "locked"
    onClaim?: () => void
}

export function AchievementRow({ name, description, icon, status, onClaim }: AchievementRowProps) {
    return (
        <motion.div
            whileHover={{ scale: status !== "locked" ? 1.01 : 1 }}
            className={cn(
                "flex items-center gap-5 rounded-2xl border px-5 py-4 transition-all duration-200",
                status === "completed" && "border-amber-200/60 bg-amber-50/40 dark:border-amber-500/15 dark:bg-amber-950/20",
                status === "claim" && "border-blue-200/60 bg-blue-50/40 dark:border-blue-500/15 dark:bg-blue-950/20",
                status === "locked" && "opacity-45 grayscale-[30%]"
            )}
        >
            {/* Icon */}
            <div className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
                status === "completed" && "bg-amber-100 dark:bg-amber-900/40",
                status === "claim" && "bg-blue-100 dark:bg-blue-900/40",
                status === "locked" && "bg-muted"
            )}>
                {icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className="font-semibold leading-tight">{name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
            </div>

            {/* Status — unified width */}
            <div className="w-[110px] flex justify-end shrink-0">
                {status === "completed" && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-1.5 rounded-full bg-amber-500/15 dark:bg-amber-500/20 px-3.5 py-1.5"
                    >
                        <Check className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Kazanıldı</span>
                    </motion.div>
                )}
                {status === "claim" && (
                    <button
                        onClick={onClaim}
                        className="flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white px-4 py-1.5 text-xs font-semibold transition-all shadow-sm shadow-blue-500/25"
                    >
                        Ödül Al
                    </button>
                )}
                {status === "locked" && (
                    <div className="flex items-center gap-1.5 rounded-full bg-muted px-3.5 py-1.5">
                        <Lock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Kilitli</span>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
