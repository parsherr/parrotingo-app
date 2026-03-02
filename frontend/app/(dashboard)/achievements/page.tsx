"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Globe, Sparkles, Star, TrendingUp, Trophy, Users, Zap } from "lucide-react"
import { Award } from "lucide-react"
import confetti from "canvas-confetti"

import { AchievementRow } from "@/components/ui/achievement-row"

type AchievementStatus = "completed" | "claim" | "locked"

interface Achievement {
    id: string
    name: string
    desc: string
    icon: React.ReactNode
    status: AchievementStatus
    xpReward: number
}

const initialAchievements: Achievement[] = [
    { id: "first-step", name: "İlk Adım", desc: "İlk dersini tamamla", icon: <Star className="h-5 w-5 text-amber-500" />, status: "completed", xpReward: 50 },
    { id: "word-hunter", name: "Kelime Avcısı", desc: "50 kelime öğren", icon: <BookOpen className="h-5 w-5 text-blue-500" />, status: "completed", xpReward: 100 },
    { id: "weekly-star", name: "Haftanın Yıldızı", desc: "7 gün üst üste çalış", icon: <TrendingUp className="h-5 w-5 text-blue-500" />, status: "claim", xpReward: 75 },
    { id: "perfectionist", name: "Mükemmeliyetçi", desc: "Bir dersten %100 al", icon: <Award className="h-5 w-5 text-violet-500" />, status: "claim", xpReward: 80 },
    { id: "social-butterfly", name: "Sosyal Kelebek", desc: "5 arkadaş ekle", icon: <Users className="h-5 w-5 text-pink-500" />, status: "locked", xpReward: 60 },
    { id: "marathon-runner", name: "Maraton Koşucusu", desc: "30 gün üst üste çalış", icon: <Trophy className="h-5 w-5 text-orange-500" />, status: "locked", xpReward: 150 },
    { id: "dictionary-master", name: "Sözlük Ustası", desc: "500 kelime öğren", icon: <Sparkles className="h-5 w-5 text-sky-500" />, status: "locked", xpReward: 200 },
    { id: "language-genius", name: "Dil Dahisi", desc: "Tüm A1 patikasını bitir", icon: <Globe className="h-5 w-5 text-indigo-500" />, status: "locked", xpReward: 300 },
]

const LEVELS = [
    { level: 11, title: "Çırak Dilci", xp: 700 },
    { level: 12, title: "Usta Dilci", xp: 1000 },
    { level: 13, title: "Uzman Dilci", xp: 1400 },
]

function fireLevelUpCelebration() {
    const end = Date.now() + 3 * 1000
    const colors = ["#3b82f6", "#60a5fa", "#fbbf24", "#f59e0b", "#a855f7", "#ec4899"]

    const frame = () => {
        if (Date.now() > end) return

        confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            startVelocity: 60,
            origin: { x: 0, y: 0.5 },
            colors,
        })
        confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            startVelocity: 60,
            origin: { x: 1, y: 0.5 },
            colors,
        })

        requestAnimationFrame(frame)
    }

    frame()
}

export default function AchievementsPage() {
    const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements)
    const [currentXp, setCurrentXp] = useState(850)
    const [levelUpMessage, setLevelUpMessage] = useState<string | null>(null)

    const currentLevelData = LEVELS.reduce((prev, curr) => (currentXp >= curr.xp ? curr : prev), LEVELS[0])
    const nextLevelData = LEVELS.find(l => l.xp > currentXp) || LEVELS[LEVELS.length - 1]
    const nextLevelXp = nextLevelData.xp
    const progress = Math.min((currentXp / nextLevelXp) * 100, 100)

    const completedCount = achievements.filter(a => a.status === "completed").length
    const claimCount = achievements.filter(a => a.status === "claim").length

    const handleClaim = (achievementId: string) => {
        const achievement = achievements.find(a => a.id === achievementId)
        if (!achievement) return

        const newXp = currentXp + achievement.xpReward

        // Check for level up
        const wasLevel = LEVELS.reduce((prev, curr) => (currentXp >= curr.xp ? curr : prev), LEVELS[0])
        const newLevel = LEVELS.reduce((prev, curr) => (newXp >= curr.xp ? curr : prev), LEVELS[0])

        setCurrentXp(newXp)
        setAchievements(prev =>
            prev.map(a =>
                a.id === achievementId ? { ...a, status: "completed" as AchievementStatus } : a
            )
        )

        // Level up celebration
        if (newLevel.level > wasLevel.level) {
            setTimeout(() => {
                fireLevelUpCelebration()
                setLevelUpMessage(`🎉 Level ${newLevel.level} — ${newLevel.title}!`)
                setTimeout(() => setLevelUpMessage(null), 4000)
            }, 600)
        }
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Level Up Toast */}
            <AnimatePresence>
                {levelUpMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.9 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 text-white px-8 py-4 shadow-2xl shadow-blue-500/30"
                    >
                        <p className="text-lg font-bold text-center">{levelUpMessage}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* XP Progress Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm"
            >
                {/* Subtle gradient decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-full" />

                <div className="relative">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                                <Zap className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Level {currentLevelData.level}</p>
                                <p className="text-lg font-bold leading-tight">{currentLevelData.title}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <motion.p
                                key={currentXp}
                                initial={{ scale: 1.2, color: "#3b82f6" }}
                                animate={{ scale: 1, color: "#3b82f6" }}
                                className="text-2xl font-bold"
                            >
                                {currentXp}<span className="text-sm font-normal text-muted-foreground"> / {nextLevelXp}</span>
                            </motion.p>
                            <p className="text-xs text-muted-foreground">XP</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full"
                        />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground text-center">
                        {currentXp >= nextLevelXp ? (
                            <span className="font-bold text-blue-500">Seviye tamamlandı! 🎉</span>
                        ) : (
                            <>Sonraki seviye için <span className="font-bold text-foreground">{nextLevelXp - currentXp} XP</span> kaldı!</>
                        )}
                    </p>
                </div>
            </motion.section>

            {/* Stats summary */}
            <div className="grid grid-cols-3 gap-3">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl border bg-card p-4 text-center"
                >
                    <p className="text-2xl font-bold">{achievements.length}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Toplam</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="rounded-2xl border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-500/15 p-4 text-center"
                >
                    <motion.p key={completedCount} className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {completedCount}
                    </motion.p>
                    <p className="text-xs text-muted-foreground mt-0.5">Kazanıldı</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-500/15 p-4 text-center"
                >
                    <motion.p key={claimCount} className="text-2xl font-bold text-blue-500">
                        {claimCount}
                    </motion.p>
                    <p className="text-xs text-muted-foreground mt-0.5">Ödül Bekliyor</p>
                </motion.div>
            </div>

            {/* Achievement list */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold">Başarımlar</h2>
                <div className="space-y-2">
                    {achievements.map((achievement, i) => (
                        <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * i + 0.25 }}
                        >
                            <AchievementRow
                                name={achievement.name}
                                description={`${achievement.desc} • +${achievement.xpReward} XP`}
                                icon={achievement.icon}
                                status={achievement.status}
                                onClaim={() => handleClaim(achievement.id)}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
