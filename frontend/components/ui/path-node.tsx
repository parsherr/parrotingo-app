"use client"

import { motion } from "framer-motion"
import { Star, Trophy } from "lucide-react"

interface PathNodeProps {
    status: "completed" | "current" | "locked" | "chest"
    label?: string
    index: number
}

export function PathNode({ status, label, index }: PathNodeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            style={{ marginLeft: `${Math.sin(index * 0.8) * 60}px` }}
            className="relative"
        >
            {status === "completed" && (
                <button className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-transform hover:scale-110">
                    <Star className="h-7 w-7 fill-white" />
                </button>
            )}
            {status === "current" && (
                <div className="flex flex-col items-center gap-2">
                    <motion.button
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 text-white shadow-xl shadow-blue-300 dark:shadow-blue-900/40 ring-4 ring-blue-200 dark:ring-blue-800"
                    >
                        <span className="text-sm font-bold">{label}</span>
                    </motion.button>
                </div>
            )}
            {status === "locked" && (
                <button className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground shadow-md cursor-not-allowed">
                    <Star className="h-7 w-7" />
                </button>
            )}
            {status === "chest" && (
                <button className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground shadow-md cursor-not-allowed">
                    <Trophy className="h-7 w-7" />
                </button>
            )}
        </motion.div>
    )
}
