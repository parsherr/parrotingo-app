"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    Bell,
    BookOpen,
    ChevronsUpDown,
    Home,
    LogOut,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { SettingsModal } from "@/components/settings-modal"
import { useAuth } from "@/lib/auth-context"

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

    const { user, logout } = useAuth()
    const pathname = usePathname()
    const router = useRouter()

    const displayName = user?.name || user?.email?.split("@")[0] || "User"
    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    const handleLogout = async () => {
        await logout()
        router.push("/auth")
    }

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
                        "radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.4) 0%, rgba(30, 58, 138, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
                        "radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
                        "radial-gradient(circle at 70% 30%, rgba(14, 165, 233, 0.4) 0%, rgba(37, 99, 235, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
                        "radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.4) 0%, rgba(30, 58, 138, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
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
                            <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white">
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                    <Avatar className="h-8 w-8 shrink-0 border border-border">
                                        <AvatarImage src={user?.avatarUrl || undefined} alt={displayName} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs font-semibold">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium leading-tight truncate">{displayName}</p>
                                        <p className="text-xs text-muted-foreground leading-tight truncate">{user?.email}</p>
                                    </div>
                                    <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" align="start" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-xl">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex items-center gap-3 px-1 py-1.5">
                                        <Avatar className="h-9 w-9 border border-border">
                                            <AvatarImage src={user?.avatarUrl || undefined} alt={displayName} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs font-semibold">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold leading-tight truncate">{displayName}</p>
                                            <p className="text-xs text-muted-foreground leading-tight truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="gap-2 rounded-lg cursor-pointer"
                                    onClick={() => {
                                        navigateTo("/profile")
                                    }}
                                >
                                    <User className="h-4 w-4" />
                                    <span>Profil</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="gap-2 rounded-lg cursor-pointer"
                                    onClick={() => {
                                        setSettingsOpen(true)
                                        setMobileMenuOpen(false)
                                    }}
                                >
                                    <Settings className="h-4 w-4" />
                                    <span>Ayarlar</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="gap-2 rounded-lg cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Çıkış Yap</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                            <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white">
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                    <Avatar className="h-8 w-8 shrink-0 border border-border">
                                        <AvatarImage src={user?.avatarUrl || undefined} alt={displayName} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs font-semibold">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium leading-tight truncate">{displayName}</p>
                                        <p className="text-xs text-muted-foreground leading-tight truncate">{user?.email}</p>
                                    </div>
                                    <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" align="start" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-xl">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex items-center gap-3 px-1 py-1.5">
                                        <Avatar className="h-9 w-9 border border-border">
                                            <AvatarImage src={user?.avatarUrl || undefined} alt={displayName} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs font-semibold">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold leading-tight truncate">{displayName}</p>
                                            <p className="text-xs text-muted-foreground leading-tight truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="gap-2 rounded-lg cursor-pointer"
                                    onClick={() => navigateTo("/profile")}
                                >
                                    <User className="h-4 w-4" />
                                    <span>Profil</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="gap-2 rounded-lg cursor-pointer"
                                    onClick={() => setSettingsOpen(true)}
                                >
                                    <Settings className="h-4 w-4" />
                                    <span>Ayarlar</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="gap-2 rounded-lg cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Çıkış Yap</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                        <div className="flex items-center gap-2">
                            {/* Notifications Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-2xl relative">
                                        <Bell className="h-5 w-5" />
                                        {notifications > 0 && (
                                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                                {notifications}
                                            </span>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80 rounded-xl">
                                    <DropdownMenuLabel className="flex items-center justify-between">
                                        <span>Bildirimler</span>
                                        <span className="text-xs font-normal text-muted-foreground">{notifications} yeni</span>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="flex items-start gap-3 rounded-lg cursor-pointer p-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Trophy className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium leading-tight">Yeni başarım kazandın! 🎉</p>
                                            <p className="text-xs text-muted-foreground mt-1">İlk 10 kelimeni öğrendin. Harika gidiyorsun!</p>
                                            <p className="text-xs text-muted-foreground/60 mt-1">2 saat önce</p>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="justify-center text-sm text-muted-foreground cursor-pointer rounded-lg">
                                        Tümünü okundu işaretle
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* User Avatar Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                        <Avatar className="h-9 w-9 border-2 border-primary cursor-pointer transition-opacity hover:opacity-80">
                                            <AvatarImage src={user?.avatarUrl || undefined} alt={displayName} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs font-semibold">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 rounded-xl">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex items-center gap-3 px-1 py-1.5">
                                            <Avatar className="h-9 w-9 border border-border">
                                                <AvatarImage src={user?.avatarUrl || undefined} alt={displayName} />
                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs font-semibold">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold leading-tight truncate">{displayName}</p>
                                                <p className="text-xs text-muted-foreground leading-tight truncate">{user?.email}</p>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="gap-2 rounded-lg cursor-pointer"
                                        onClick={() => navigateTo("/profile")}
                                    >
                                        <User className="h-4 w-4" />
                                        <span>Profil</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="gap-2 rounded-lg cursor-pointer"
                                        onClick={() => setSettingsOpen(true)}
                                    >
                                        <Settings className="h-4 w-4" />
                                        <span>Ayarlar</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="gap-2 rounded-lg cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Çıkış Yap</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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
