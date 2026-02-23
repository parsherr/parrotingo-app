"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AchievementRowProps {
    name: string
    description: string
    icon: React.ReactNode
    status: "completed" | "claim" | "locked"
}

export function AchievementRow({ name, description, icon, status }: AchievementRowProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className={cn(
                "flex items-center gap-4 rounded-2xl border p-4 transition-all",
                status === "locked" ? "opacity-50" : ""
            )}
        >
            <div className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                status === "completed" ? "bg-amber-100 dark:bg-amber-900/30" :
                    status === "claim" ? "bg-emerald-100 dark:bg-emerald-900/30" :
                        "bg-muted"
            )}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {status === "completed" && (
                <Badge className="shrink-0 rounded-xl bg-amber-500 text-white">
                    ✓ Tamamlandı
                </Badge>
            )}
            {status === "claim" && (
                <Button size="sm" className="shrink-0 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white">
                    Ödül Al
                </Button>
            )}
            {status === "locked" && (
                <Badge variant="outline" className="shrink-0 rounded-xl text-muted-foreground">
                    🔒 Kilitli
                </Badge>
            )}
        </motion.div>
    )
}
