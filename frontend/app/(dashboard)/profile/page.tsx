"use client"

import { BookOpen, Clock, Map, PenTool, TrendingUp, Trophy } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/ui/stat-card"

const stats = [
    { label: "Toplam Ders", value: "48", icon: <BookOpen className="h-5 w-5 text-blue-500" /> },
    { label: "Kelime", value: "312", icon: <PenTool className="h-5 w-5 text-emerald-500" /> },
    { label: "Çalışma Saati", value: "24h", icon: <Clock className="h-5 w-5 text-violet-500" /> },
    { label: "En Uzun Seri", value: "14 gün", icon: <TrendingUp className="h-5 w-5 text-amber-500" /> },
]

const activities = [
    { action: "A1 Patikası - Ders 5 tamamlandı", time: "2 saat önce", icon: <Map className="h-4 w-4 text-emerald-500" /> },
    { action: "15 yeni kelime öğrenildi", time: "Dün", icon: <BookOpen className="h-4 w-4 text-blue-500" /> },
    { action: "7 Gün Seri rozeti kazanıldı", time: "3 gün önce", icon: <Trophy className="h-4 w-4 text-amber-500" /> },
    { action: "Günlük Konuşma dersine başlandı", time: "1 hafta önce", icon: <PenTool className="h-4 w-4 text-violet-500" /> },
]

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            {/* Profile header card */}
            <div className="rounded-3xl border bg-card p-6">
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <Avatar className="h-20 w-20 ring-4 ring-emerald-200 dark:ring-emerald-800">
                        <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User" />
                        <AvatarFallback className="text-2xl">JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-2xl font-bold">John Doe</h2>
                        <p className="text-muted-foreground">İngilizce öğreniyor • 30 gündür üye</p>
                        <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                            <Badge className="rounded-xl bg-emerald-500 text-white">A2 Seviye</Badge>
                            <Badge variant="outline" className="rounded-xl">12 Rozet</Badge>
                            <Badge variant="outline" className="rounded-xl">2.4K XP</Badge>
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
