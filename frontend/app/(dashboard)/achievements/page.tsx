"use client"

import { BookOpen, Globe, Sparkles, Star, TrendingUp, Trophy, Users } from "lucide-react"
import { Award } from "lucide-react"

import { AchievementRow } from "@/components/ui/achievement-row"
import { Progress } from "@/components/ui/progress"

const achievements = [
    { name: "İlk Adım", desc: "İlk dersini tamamla", icon: <Star className="h-6 w-6 text-amber-500" />, status: "completed" as const },
    { name: "Kelime Avcısı", desc: "50 kelime öğren", icon: <BookOpen className="h-6 w-6 text-blue-500" />, status: "completed" as const },
    { name: "Haftanın Yıldızı", desc: "7 gün üst üste çalış", icon: <TrendingUp className="h-6 w-6 text-emerald-500" />, status: "claim" as const },
    { name: "Mükemmeliyetçi", desc: "Bir dersten %100 al", icon: <Award className="h-6 w-6 text-violet-500" />, status: "claim" as const },
    { name: "Sosyal Kelebek", desc: "5 arkadaş ekle", icon: <Users className="h-6 w-6 text-pink-500" />, status: "locked" as const },
    { name: "Maraton Koşucusu", desc: "30 gün üst üste çalış", icon: <Trophy className="h-6 w-6 text-orange-500" />, status: "locked" as const },
    { name: "Sözlük Ustası", desc: "500 kelime öğren", icon: <Sparkles className="h-6 w-6 text-cyan-500" />, status: "locked" as const },
    { name: "Dil Dahisi", desc: "Tüm A1 patikasını bitir", icon: <Globe className="h-6 w-6 text-indigo-500" />, status: "locked" as const },
]

export default function AchievementsPage() {
    // Örnek XP verileri
    const currentXp = 850;
    const nextLevelXp = 1000;
    const progress = (currentXp / nextLevelXp) * 100;

    return (
        <div className="space-y-8">
            {/* XP Progress Bar Section */}
            <section className="bg-card border rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Level 12</h3>
                        <p className="text-2xl font-bold">Usta Dilci</p>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-emerald-500">{currentXp}</span>
                        <span className="text-muted-foreground"> / {nextLevelXp} XP</span>
                    </div>
                </div>
                <Progress value={progress} className="h-3 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${progress}%` }} />
                </Progress>
                <p className="mt-3 text-sm text-muted-foreground text-center">
                    Sonraki seviye için <span className="font-bold text-foreground">{nextLevelXp - currentXp} XP</span> kaldı!
                </p>
            </section>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Başarımlar</h2>

                <div className="space-y-3">
                    {achievements.map((achievement) => (
                        <AchievementRow
                            key={achievement.name}
                            name={achievement.name}
                            description={achievement.desc}
                            icon={achievement.icon}
                            status={achievement.status}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
