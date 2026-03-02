"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

/* ───────────── Slider Data ───────────── */
const slides = [
    {
        image: "/mascot.png",
        title: "Dil öğrenmenin en eğlenceli yolu",
        description: "Parrotingo ile her gün yeni kelimeler öğren ve pratik yap.",
    },
    {
        image: "/mascot.png",
        title: "Kendi hızında ilerle",
        description: "Sana özel patikalar ile seviyene uygun derslerle başla.",
    },
    {
        image: "/mascot.png",
        title: "Başarılarını takip et",
        description: "İstatistiklerini gör, seri günlerini koru ve rozetler kazan.",
    },
]

/* ───────────── Infinite Slider ───────────── */
function InfiniteSlider() {
    const [current, setCurrent] = useState(0)

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % slides.length)
    }, [])

    useEffect(() => {
        const interval = setInterval(next, 4000)
        return () => clearInterval(interval)
    }, [next])

    return (
        <div className="flex flex-col items-center justify-center h-full px-12">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center text-center"
                >
                    <div className="relative mb-8">
                        <div className="absolute -inset-6 rounded-3xl bg-white/10 backdrop-blur-sm" />
                        <img
                            src={slides[current].image}
                            alt="Parrotingo"
                            className="relative h-52 w-52 object-contain drop-shadow-lg"
                        />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                        {slides[current].title}
                    </h3>
                    <p className="text-white/70 text-base max-w-xs leading-relaxed">
                        {slides[current].description}
                    </p>
                </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex gap-2 mt-10">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${i === current
                            ? "w-8 bg-white"
                            : "w-2.5 bg-white/30 hover:bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}

/* ───────────── Auth Page ───────────── */
export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "signup">("login")
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { login, signup, loginWithGoogle, isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    // Redirect if already authenticated
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push("/")
        }
    }, [isAuthenticated, isLoading, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsSubmitting(true)

        try {
            let result: { success: boolean; error?: string }

            if (mode === "login") {
                result = await login(email, password)
            } else {
                result = await signup(email, password, name || undefined)
            }

            if (result.success) {
                router.push("/")
            } else {
                setError(result.error || "An error occurred")
            }
        } catch {
            setError("An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleGoogleLogin = async () => {
        // For now, Google login is prepared but needs Google Client ID configured
        // This will work with Google Identity Services or a popup flow
        setError("Google login requires GOOGLE_CLIENT_ID configuration. Please use email/password.")
    }

    // Show loading screen while checking auth
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen">
            {/* Left — Slider Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5" />
                <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-white/5" />
                <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-white/5" />

                {/* Logo */}
                <div className="absolute top-8 left-8 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white font-bold text-sm">
                        P
                    </div>
                    <span className="text-white font-semibold text-lg">Parrotingo</span>
                </div>

                <InfiniteSlider />
            </div>

            {/* Right — Auth Form */}
            <div className="flex flex-1 items-center justify-center bg-background px-6 py-12">
                <div className="w-full max-w-sm space-y-8">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2 justify-center mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white font-bold">
                            P
                        </div>
                        <span className="text-xl font-bold">Parrotingo</span>
                    </div>

                    {/* Header */}
                    <div className="text-center space-y-1">
                        <h1 className="text-3xl font-bold">
                            {mode === "login" ? "Welcome back" : "Create account"}
                        </h1>
                        <p className="text-muted-foreground">
                            {mode === "login"
                                ? "Sign in to continue learning"
                                : "Start your language journey today"}
                        </p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-500"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Google Button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border bg-background hover:bg-muted transition-colors text-sm font-medium disabled:opacity-50"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-background px-3 text-muted-foreground">or</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Name field — only for signup */}
                        <AnimatePresence>
                            {mode === "signup" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <label className="block text-sm font-medium mb-1.5">Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full h-12 rounded-xl border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="mail@example.com"
                                    required
                                    className="w-full h-12 rounded-xl border bg-background pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium">Password</label>
                                {mode === "login" && (
                                    <button type="button" className="text-xs text-blue-500 hover:text-blue-600 font-medium">
                                        Forgot password?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full h-12 rounded-xl border bg-background pl-11 pr-12 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    {mode === "login" ? "Sign in" : "Create account"}
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle mode */}
                    <p className="text-center text-sm text-muted-foreground">
                        {mode === "login" ? (
                            <>
                                New to Parrotingo?{" "}
                                <button
                                    onClick={() => { setMode("signup"); setError("") }}
                                    className="text-blue-500 hover:text-blue-600 font-semibold"
                                >
                                    Create Account
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button
                                    onClick={() => { setMode("login"); setError("") }}
                                    className="text-blue-500 hover:text-blue-600 font-semibold"
                                >
                                    Sign in
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    )
}
