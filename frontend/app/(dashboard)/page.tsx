"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { BookOpen, Clock, Loader2, Map, Play, Sparkles, TrendingUp } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

const blogPreviews = [
    {
        title: "Etkili Kelime Öğrenme Teknikleri",
        author: "Parrotingo Ekibi",
        excerpt: "Bilimsel olarak kanıtlanmış 5 teknik ile kelime haznenizi hızla genişletin.",
        category: "İpuçları",
        readTime: "5 dk",
    },
    {
        title: "Dil Öğreniminde Motivasyon",
        author: "Ayşe Yılmaz",
        excerpt: "Motivasyonunuzu kaybetmemeniz için pratik öneriler.",
        category: "Motivasyon",
        readTime: "7 dk",
    },
    {
        title: "Gramer mi Kelime mi?",
        author: "Mehmet Kaya",
        excerpt: "Dil öğreniminde öncelik sıralaması ve doğru denge.",
        category: "Strateji",
        readTime: "4 dk",
    },
    {
        title: "Günlük Rutinler ile Dil Öğrenimi",
        author: "Parrotingo Ekibi",
        excerpt: "Her gün 15 dakikanızı ayırarak nasıl ilerleme kaydedersiniz?",
        category: "Rehber",
        readTime: "6 dk",
    },
]

export default function HomePage() {
    const { user, isLoading, isAuthenticated } = useAuth()
    const router = useRouter()

    // Redirect to auth if not authenticated
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

    return (
        <div className="space-y-0">
            {/* Welcome Section — no border, wide, breathable */}
            <section className="py-14 md:py-20 px-2">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex flex-col items-center justify-center gap-14 md:gap-24 md:flex-row">
                        {/* Mascot — Left */}
                        <motion.div
                            initial={{ scale: 0.85 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.15, type: "spring", stiffness: 180 }}
                            className="shrink-0"
                        >
                            <img
                                src="/mascot.png"
                                alt="Parrotingo Mascot"
                                className="h-52 w-52 object-contain md:h-64 md:w-64"
                            />
                        </motion.div>

                        {/* Text + Buttons — Right */}
                        <div className="space-y-8 text-center">
                            <div className="space-y-2">
                                <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
                                    Welcome, <span className="text-blue-500">{displayName.split(" ")[0]}</span>!
                                </h1>
                                <p className="text-xl text-muted-foreground">
                                    How is your day?
                                </p>
                            </div>

                            <div className="flex flex-col gap-3.5 w-64 mx-auto">
                                <Link href="/path" className="w-full">
                                    <Button size="lg" className="w-full rounded-full bg-blue-500 hover:bg-blue-600 text-white gap-3 text-lg h-14 shadow-sm">
                                        <Play className="h-5 w-5 fill-white" />
                                        Resume
                                    </Button>
                                </Link>
                                <Link
                                    href="/path"
                                    className="text-center text-base font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
                                >
                                    Patika
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Your Stats Section — dark blue bg, edge-to-edge (negative margin to break out of parent padding) */}
            <section className="-mx-4 md:-mx-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-slate-800 dark:bg-slate-900 px-8 py-10 md:px-14 md:py-12 rounded-2xl"
                >
                    <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                        {/* Left — Stats */}
                        <div className="space-y-6 flex-1">
                            <h2 className="text-2xl font-bold text-white">Your Stats</h2>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                                        <Sparkles className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <p className="text-base text-slate-200">
                                        <span className="font-bold text-white text-lg">{user.questionsCompleted}</span>{" "}
                                        soru çözüldü
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                                        <BookOpen className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <p className="text-base text-slate-200">
                                        <span className="font-bold text-white text-lg">{user.wordsLearned}</span>{" "}
                                        kelime öğrenildi
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                                        <TrendingUp className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <p className="text-base text-slate-200">
                                        <span className="font-bold text-white text-lg">{user.streakDays}</span>{" "}
                                        gün girildi
                                    </p>
                                </div>
                            </div>

                            <Link href="/wordbank">
                                <Button className="rounded-full bg-blue-500 hover:bg-blue-600 text-white px-6 gap-2 h-11 mt-1">
                                    <BookOpen className="h-4 w-4" />
                                    Manage Wordbank
                                </Button>
                            </Link>
                        </div>

                        {/* Right — Mascot checking todo list */}
                        <div className="hidden md:flex items-center justify-center pr-8">
                            <img
                                src="/mascot.png"
                                alt="Parrotingo Mascot checking list"
                                className="h-48 w-48 object-contain opacity-90"
                            />
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Blog Preview Section */}
            <section className="space-y-4 pt-8 px-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Blog</h2>
                    <Link href="/blog">
                        <Button variant="ghost" className="rounded-2xl">
                            Keşfet
                        </Button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {blogPreviews.map((post) => (
                        <motion.div
                            key={post.title}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            className="h-full"
                        >
                            <Card className="flex flex-col h-full overflow-hidden rounded-3xl border hover:border-primary/50 transition-all duration-300">
                                <div className="aspect-[16/10] shrink-0 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 flex items-end">
                                    <Badge className="rounded-xl bg-blue-500 text-white">{post.category}</Badge>
                                </div>
                                <CardContent className="p-4 flex flex-col flex-1">
                                    <h3 className="font-semibold line-clamp-1">{post.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-1">{post.excerpt}</p>
                                    <div className="mt-4 pt-3 border-t flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground truncate max-w-[100px]">{post.author}</span>
                                        <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                                            <Clock className="h-3 w-3" />
                                            {post.readTime}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    )
}
