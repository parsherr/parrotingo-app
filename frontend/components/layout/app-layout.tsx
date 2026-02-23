"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    Bell,
    BookOpen,
    Home,
    Map,
    Menu,
    PanelLeft,
    PenTool,
    Settings,
    Trophy,
    User,
    X,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { SettingsModal } from "@/components/settings-modal"

const sidebarItems = [
    { title: "Ana Sayfa", icon: <Home />, href: "/" },
    { title: "Patika", icon: <Map />, href: "/path" },
    { title: "Sözlük", icon: <BookOpen />, href: "/wordbank" },
    { title: "Başarımlar", icon: <Trophy />, href: "/achievements" },
    { title: "Profil", icon: <User />, href: "/profile" },
    { title: "Blog", icon: <PenTool />, href: "/blog" },
]

interface AppLayoutProps {
    children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [notifications] = useState(5)

    const pathname = usePathname()
    const router = useRouter()

    const navigateTo = (href: string) => {
        router.push(href)
        setMobileMenuOpen(false)
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            {/* Animated gradient background */}
            <motion.div
                className="absolute inset-0 -z-10 opacity-20"
                animate={{
                    background: [
                        "radial-gradient(circle at 50% 50%, rgba(120, 41, 190, 0.5) 0%, rgba(53, 71, 125, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
                        "radial-gradient(circle at 30% 70%, rgba(233, 30, 99, 0.5) 0%, rgba(81, 45, 168, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
                        "radial-gradient(circle at 70% 30%, rgba(76, 175, 80, 0.5) 0%, rgba(32, 119, 188, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
                        "radial-gradient(circle at 50% 50%, rgba(120, 41, 190, 0.5) 0%, rgba(53, 71, 125, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
                    ],
                }}
                transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />

            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Sidebar - Mobile */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 transform bg-background transition-transform duration-300 ease-in-out md:hidden",
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <div className="flex h-full flex-col border-r">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                                <span className="text-lg font-bold">P</span>
                            </div>
                            <div>
                                <h2 className="font-semibold">Parrotingo</h2>
                                <p className="text-xs text-muted-foreground">Dil Öğrenim</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 px-3 py-2">
                        <div className="space-y-1">
                            {sidebarItems.map((item) => (
                                <div key={item.title} className="mb-1">
                                    <button
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                                            pathname === item.href ? "bg-primary/10 text-primary" : "hover:bg-muted",
                                        )}
                                        onClick={() => navigateTo(item.href)}
                                    >
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    <div className="border-t p-3">
                        <div className="space-y-1">
                            <button
                                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted"
                                onClick={() => {
                                    setSettingsOpen(true)
                                    setMobileMenuOpen(false)
                                }}
                            >
                                <Settings className="h-5 w-5" />
                                <span>Settings</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar - Desktop */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-30 hidden w-64 transform border-r bg-background transition-transform duration-300 ease-in-out md:block",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <div className="flex h-full flex-col">
                    <div className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                                <span className="text-lg font-bold">P</span>
                            </div>
                            <div>
                                <h2 className="font-semibold">Parrotingo</h2>
                                <p className="text-xs text-muted-foreground">Dil Öğrenim</p>
                            </div>
                        </div>
                    </div>

                    <ScrollArea className="flex-1 px-3 py-2">
                        <div className="space-y-1">
                            {sidebarItems.map((item) => (
                                <div key={item.title} className="mb-1">
                                    <button
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                                            pathname === item.href ? "bg-primary/10 text-primary" : "hover:bg-muted",
                                        )}
                                        onClick={() => navigateTo(item.href)}
                                    >
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    <div className="border-t p-3">
                        <div className="space-y-1">
                            <button
                                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted"
                                onClick={() => setSettingsOpen(true)}
                            >
                                <Settings className="h-5 w-5" />
                                <span>Settings</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={cn("min-h-screen transition-all duration-300 ease-in-out", sidebarOpen ? "md:pl-64" : "md:pl-0")}>
                <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
                        <Menu className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <PanelLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex flex-1 items-center justify-between">
                        <h1 className="text-xl font-semibold">Parrotingo</h1>
                        <div className="flex items-center gap-3">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-2xl relative">
                                            <Bell className="h-5 w-5" />
                                            {notifications > 0 && (
                                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                                    {notifications}
                                                </span>
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Bildirimler</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <Avatar className="h-9 w-9 border-2 border-primary">
                                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-6">
                    {children}
                </main>
            </div>

            <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
        </div>
    )
}
