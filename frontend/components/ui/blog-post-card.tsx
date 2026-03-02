"use client"

import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BlogPostCardProps {
    title: string
    excerpt: string
    category: string
    readTime: string
    date: string
    author: string
}

export function BlogPostCard({ title, excerpt, category, readTime, date, author }: BlogPostCardProps) {
    return (
        <motion.div whileHover={{ scale: 1.005 }} className="group">
            <div className="flex gap-4 rounded-2xl border p-4 transition-colors hover:border-primary/40">
                <div className="hidden sm:flex h-20 w-28 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                    <Badge className="rounded-lg bg-blue-500 text-white text-xs">{category}</Badge>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{title}</h3>
                        <Badge variant="outline" className="shrink-0 rounded-lg text-xs sm:hidden">{category}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{excerpt}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{author}</span>
                        <span>•</span>
                        <span>{date}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {readTime}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
