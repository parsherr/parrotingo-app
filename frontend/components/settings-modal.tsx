"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Globe, Loader2, Monitor, Moon, Settings, Sparkles, Sun, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"

interface SettingsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
    const [settingsCategory, setSettingsCategory] = useState("general")
    const { theme: themeMode, setTheme: setThemeMode } = useTheme()
    const [language, setLanguage] = useState("tr")

    const { user, refreshUser } = useAuth()

    // ─── Account form state ───
    const [editName, setEditName] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

    // Sync form state when user data changes or modal opens
    useEffect(() => {
        if (user && open) {
            setEditName(user.name || "")
            setSaveMessage(null)
        }
    }, [user, open])

    // Derived user display values
    const displayName = user?.name || user?.email?.split("@")[0] || "User"
    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    // ─── Save profile handler ───
    const handleSaveProfile = async () => {
        if (!user) return

        setIsSaving(true)
        setSaveMessage(null)

        try {
            const res = await api.put<{ user: typeof user }>("/auth/profile", {
                name: editName.trim() || undefined,
            })

            if (res.success) {
                await refreshUser()
                setSaveMessage({ type: "success", text: "Değişiklikler kaydedildi!" })
                setTimeout(() => setSaveMessage(null), 3000)
            } else {
                setSaveMessage({ type: "error", text: res.error || "Bir hata oluştu." })
            }
        } catch {
            setSaveMessage({ type: "error", text: "Bağlantı hatası. Tekrar deneyin." })
        } finally {
            setIsSaving(false)
        }
    }

    const hasChanges = editName.trim() !== (user?.name || "")

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">Ayarlar</DialogTitle>
                    <DialogDescription>Uygulama ayarlarınızı buradan yönetin.</DialogDescription>
                </DialogHeader>

                <div className="flex gap-2 border-b pb-4">
                    {[
                        { key: "general", label: "Genel", icon: <Settings className="h-4 w-4" /> },
                        { key: "preferences", label: "Tercihler", icon: <Sparkles className="h-4 w-4" /> },
                        { key: "account", label: "Hesap", icon: <User className="h-4 w-4" /> },
                    ].map((cat) => (
                        <Button
                            key={cat.key}
                            variant={settingsCategory === cat.key ? "default" : "outline"}
                            className="rounded-2xl flex items-center gap-2 text-sm"
                            onClick={() => setSettingsCategory(cat.key)}
                        >
                            {cat.icon}
                            {cat.label}
                        </Button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={settingsCategory}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-6 py-4"
                    >
                        {settingsCategory === "general" && (
                            <>
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Tema Rengi</Label>
                                    <div className="flex gap-2">
                                        {[
                                            { value: "light", label: "Açık", icon: <Sun className="h-4 w-4" /> },
                                            { value: "dark", label: "Koyu", icon: <Moon className="h-4 w-4" /> },
                                            { value: "system", label: "Sistem", icon: <Monitor className="h-4 w-4" /> },
                                        ].map((theme) => (
                                            <Button
                                                key={theme.value}
                                                variant={themeMode === theme.value ? "default" : "outline"}
                                                className="flex-1 rounded-2xl flex items-center justify-center gap-2"
                                                onClick={() => setThemeMode(theme.value)}
                                            >
                                                {theme.icon}
                                                {theme.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Dil Seçimi</Label>
                                    <Select value={language} onValueChange={setLanguage}>
                                        <SelectTrigger className="rounded-2xl">
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4" />
                                                <SelectValue placeholder="Dil seçin" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl">
                                            <SelectItem value="tr" className="rounded-xl">
                                                🇹🇷 Türkçe
                                            </SelectItem>
                                            <SelectItem value="en" className="rounded-xl">
                                                🇬🇧 English
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}

                        {settingsCategory === "preferences" && (
                            <>
                                <div className="space-y-4">
                                    <PreferenceRow title="Bildirimler" description="Günlük hatırlatma bildirimleri" actionLabel="Açık" />
                                    <PreferenceRow title="Ses Efektleri" description="Doğru/yanlış cevap sesleri" actionLabel="Açık" />
                                    <div className="flex items-center justify-between rounded-2xl border p-4">
                                        <div>
                                            <p className="font-medium">Günlük Hedef</p>
                                            <p className="text-sm text-muted-foreground">Günlük kelime öğrenim hedefi</p>
                                        </div>
                                        <Select defaultValue="10">
                                            <SelectTrigger className="w-[100px] rounded-2xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl">
                                                <SelectItem value="5" className="rounded-xl">5 kelime</SelectItem>
                                                <SelectItem value="10" className="rounded-xl">10 kelime</SelectItem>
                                                <SelectItem value="20" className="rounded-xl">20 kelime</SelectItem>
                                                <SelectItem value="30" className="rounded-xl">30 kelime</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </>
                        )}

                        {settingsCategory === "account" && (
                            <>
                                <div className="space-y-4">
                                    {/* User profile card */}
                                    <div className="flex items-center gap-4 rounded-2xl border p-4">
                                        <Avatar className="h-16 w-16 border-2 border-border">
                                            <AvatarImage src={user?.avatarUrl || undefined} alt={displayName} />
                                            <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-lg truncate">{displayName}</p>
                                            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {user?.provider === "GOOGLE" ? "Google ile giriş yapıldı" : "E-posta ile kayıt olundu"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Name field */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">Kullanıcı Adı</Label>
                                        <Input
                                            className="rounded-2xl"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            placeholder="Adınızı girin"
                                        />
                                    </div>

                                    {/* Email field (read-only) */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">E-posta</Label>
                                        <Input
                                            className="rounded-2xl bg-muted/50"
                                            value={user?.email || ""}
                                            readOnly
                                            disabled
                                        />
                                        <p className="text-xs text-muted-foreground">E-posta adresi değiştirilemez.</p>
                                    </div>

                                    {/* Save message */}
                                    {saveMessage && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`text-sm font-medium ${saveMessage.type === "success" ? "text-blue-500" : "text-red-500"}`}
                                        >
                                            {saveMessage.text}
                                        </motion.p>
                                    )}

                                    {/* Action buttons */}
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1 rounded-2xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                        >
                                            Hesabı Sil
                                        </Button>
                                        <Button
                                            className="flex-1 rounded-2xl"
                                            onClick={handleSaveProfile}
                                            disabled={isSaving || !hasChanges}
                                        >
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Kaydediliyor...
                                                </>
                                            ) : (
                                                "Değişiklikleri Kaydet"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}

// Reusable component for preference toggle rows
function PreferenceRow({ title, description, actionLabel }: { title: string; description: string; actionLabel: string }) {
    return (
        <div className="flex items-center justify-between rounded-2xl border p-4">
            <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Button variant="outline" className="rounded-2xl">{actionLabel}</Button>
        </div>
    )
}
