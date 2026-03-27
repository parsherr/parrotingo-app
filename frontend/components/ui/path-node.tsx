"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Trophy, Loader2, Lock } from "lucide-react"

interface PathNodeProps {
    status: "completed" | "current" | "locked" | "chest"
    label?: string
    index: number
    unitNumber?: number
    questionNumber?: number
    isActive?: boolean
    onToggle?: () => void
}

export function PathNode({ status, label, index, unitNumber, questionNumber, isActive, onToggle }: PathNodeProps) {
    const [word, setWord] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isActive && unitNumber && questionNumber && !word) {
            fetchWord()
        }
    }, [isActive])

    async function fetchWord() {
        setLoading(true)
        try {
            const response = await fetch("/api/questions/action", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ünite: unitNumber, question: questionNumber })
            })
            const data = await response.json()
            if (data.word) {
                setWord(data.word)
            }
        } catch (error) {
            console.error("Error fetching word:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleClick = (e: React.MouseEvent) => {
        if (status === "locked" || status === "chest") return
        e.stopPropagation()
        onToggle?.()
    }

    const isInteractive = status === "completed" || status === "current"
    const bgClass = isInteractive ? "bg-blue-500" : "bg-muted"
    const shadowClass = isInteractive ? "shadow-lg shadow-blue-200 dark:shadow-blue-900/30" : "shadow-md"
    const size = 64 // All nodes same size now

    return (
        <div className="relative">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                style={{ marginLeft: `${Math.sin(index * 0.8) * 60}px` }}
                className="relative flex items-center"
            >
                <div
                    className="relative flex items-center"
                    style={{ height: `${size}px` }}
                >
                    <motion.div
                        onClick={handleClick}
                        initial={false}
                        animate={{
                            width: isActive ? (size + 160) : size,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 35,
                            mass: 0.5
                        }}
                        className={`absolute left-0 top-0 h-full flex items-center overflow-hidden cursor-pointer ${bgClass} ${shadowClass} transition-colors duration-200`}
                        style={{ borderRadius: `${size / 2}px`, zIndex: isActive ? 50 : 1 }}
                    >
                        {/* Always Fixed Icon Container */}
                        <div
                            className="flex shrink-0 items-center justify-center"
                            style={{ width: `${size}px` }}
                        >
                            {status === "current" ? (
                                <motion.div
                                    animate={{ scale: isActive ? 1 : [1, 1.1, 1] }}
                                    transition={{ duration: 2.5, repeat: isActive ? 0 : Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                                    className="flex items-center justify-center"
                                >
                                    <Star className="h-7 w-7 fill-white text-white drop-shadow-sm" />
                                </motion.div>
                            ) : status === "chest" || status === "locked" ? (
                                <Lock className="h-6 w-6 text-muted-foreground/40" />
                            ) : (
                                <Star className={`h-7 w-7 ${isInteractive ? "fill-white text-white" : "text-muted-foreground/40"}`} />
                            )}
                        </div>

                        {/* Content revealed faster */}
                        <AnimatePresence>
                            {isActive && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -5 }}
                                    transition={{ duration: 0.15, delay: 0.05 }}
                                    className="flex flex-col pr-8 whitespace-nowrap"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-white/70" />
                                            <span className="text-xs font-bold text-white/70">Yükleniyor...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-xl font-black text-white leading-none uppercase">
                                                {word || "Kelime"}
                                            </span>
                                            <span className="text-[10px] font-bold text-white/60 mt-1 uppercase tracking-widest">
                                                TIKLA VE BAŞLA
                                            </span>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Placeholder div to keep the layout stable */}
                    <div style={{ width: `${size}px` }} />
                </div>
            </motion.div>
        </div>
    )
}
