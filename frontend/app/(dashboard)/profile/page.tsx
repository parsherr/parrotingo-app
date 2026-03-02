"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Clock, Loader2, Map, PenTool, TrendingUp, Trophy } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/ui/stat-card"
import { useAuth } from "@/lib/auth-context"

const activities = [
    { action: "A1 Patikası - Ders 5 tamamlandı", time: "2 saat önce", icon: <Map className="h-4 w-4 text-blue-500" /> },
    { action: "15 yeni kelime öğrenildi", time: "Dün", icon: <BookOpen className="h-4 w-4 text-blue-500" /> },
    { action: "7 Gün Seri rozeti kazanıldı", time: "3 gün önce", icon: <Trophy className="h-4 w-4 text-amber-500" /> },
    { action: "Günlük Konuşma dersine başlandı", time: "1 hafta önce", icon: <PenTool className="h-4 w-4 text-violet-500" /> },
]

export default function ProfilePage() {
    const { user, isLoading, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/auth")
        }
    }, [isLoading, isAuthenticated, router])

    if (isLoading || !user) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        )
    }

    const displayName = user.name || user.email.split("@")[0]
    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    // Calculate member days
    const memberDays = Math.floor(
        (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    )

    const stats = [
        { label: "Toplam Ders", value: String(user.totalLessons), icon: <BookOpen className="h-5 w-5 text-blue-500" /> },
        { label: "Kelime", value: String(user.wordsLearned), icon: <PenTool className="h-5 w-5 text-blue-500" /> },
        { label: "Çalışma Saati", value: `${user.studyHours}h`, icon: <Clock className="h-5 w-5 text-violet-500" /> },
        { label: "En Uzun Seri", value: `${user.longestStreak} gün`, icon: <TrendingUp className="h-5 w-5 text-amber-500" /> },
    ]

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Profile header card */}
            <div className="rounded-3xl border bg-card p-6">
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <Avatar className="h-20 w-20 ring-4 ring-blue-200 dark:ring-blue-800">
                        <AvatarImage src={user.avatarUrl || undefined} alt={displayName} />
                        <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-2xl font-bold">{displayName}</h2>
                        <p className="text-muted-foreground">İngilizce öğreniyor • {memberDays} gündür üye</p>
                        <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                            <Badge className="rounded-xl bg-blue-500 text-white">{user.level} Seviye</Badge>
                            <Badge variant="outline" className="rounded-xl">12 Rozet</Badge>
                            <Badge variant="outline" className="rounded-xl">{user.xp.toLocaleString()} XP</Badge>
                        </div>
                    </div>
                    <Button variant="outline" className="rounded-2xl">
                        Profili Düzenle
                    </Button>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} />
                ))}
            </div>

            {/* Recent activity */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold">Son Aktiviteler</h3>
                <div className="rounded-2xl border overflow-hidden">
                    {activities.map((activity) => (
                        <div key={activity.action} className="flex items-center gap-3 border-b last:border-b-0 px-4 py-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                                {activity.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{activity.action}</p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
