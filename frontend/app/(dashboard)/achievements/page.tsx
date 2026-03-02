"use client"

import { motion } from "framer-motion"
import { BookOpen, Globe, Sparkles, Star, TrendingUp, Trophy, Users, Zap } from "lucide-react"
import { Award } from "lucide-react"

import { AchievementRow } from "@/components/ui/achievement-row"

const achievements = [
    { name: "İlk Adım", desc: "İlk dersini tamamla", icon: <Star className="h-5 w-5 text-amber-500" />, status: "completed" as const },
    { name: "Kelime Avcısı", desc: "50 kelime öğren", icon: <BookOpen className="h-5 w-5 text-blue-500" />, status: "completed" as const },
    { name: "Haftanın Yıldızı", desc: "7 gün üst üste çalış", icon: <TrendingUp className="h-5 w-5 text-blue-500" />, status: "claim" as const },
    { name: "Mükemmeliyetçi", desc: "Bir dersten %100 al", icon: <Award className="h-5 w-5 text-violet-500" />, status: "claim" as const },
    { name: "Sosyal Kelebek", desc: "5 arkadaş ekle", icon: <Users className="h-5 w-5 text-pink-500" />, status: "locked" as const },
    { name: "Maraton Koşucusu", desc: "30 gün üst üste çalış", icon: <Trophy className="h-5 w-5 text-orange-500" />, status: "locked" as const },
    { name: "Sözlük Ustası", desc: "500 kelime öğren", icon: <Sparkles className="h-5 w-5 text-sky-500" />, status: "locked" as const },
    { name: "Dil Dahisi", desc: "Tüm A1 patikasını bitir", icon: <Globe className="h-5 w-5 text-indigo-500" />, status: "locked" as const },
]

export default function AchievementsPage() {
    const currentXp = 850;
    const nextLevelXp = 1000;
    const progress = (currentXp / nextLevelXp) * 100;
    const completedCount = achievements.filter(a => a.status === "completed").length;
    const claimCount = achievements.filter(a => a.status === "claim").length;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
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
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Level 12</p>
                                <p className="text-lg font-bold leading-tight">Usta Dilci</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-blue-500">{currentXp}<span className="text-sm font-normal text-muted-foreground"> / {nextLevelXp}</span></p>
                            <p className="text-xs text-muted-foreground">XP</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full"
                        />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground text-center">
                        Sonraki seviye için <span className="font-bold text-foreground">{nextLevelXp - currentXp} XP</span> kaldı!
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
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{completedCount}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Kazanıldı</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-500/15 p-4 text-center"
                >
                    <p className="text-2xl font-bold text-blue-500">{claimCount}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Ödül Bekliyor</p>
                </motion.div>
            </div>

            {/* Achievement list */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold">Başarımlar</h2>
                <div className="space-y-2">
                    {achievements.map((achievement, i) => (
                        <motion.div
                            key={achievement.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * i + 0.25 }}
                        >
                            <AchievementRow
                                name={achievement.name}
                                description={achievement.desc}
                                icon={achievement.icon}
                                status={achievement.status}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
