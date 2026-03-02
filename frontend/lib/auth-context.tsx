"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { api } from "@/lib/api"

// ─── Types ───
export interface User {
    id: string
    email: string
    name: string | null
    avatarUrl: string | null
    provider: "CREDENTIALS" | "GOOGLE"
    questionsCompleted: number
    wordsLearned: number
    streakDays: number
    totalLessons: number
    studyHours: number
    longestStreak: number
    xp: number
    level: string
    createdAt: string
    updatedAt: string
}

interface AuthState {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    signup: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>
    loginWithGoogle: (credential: string) => Promise<{ success: boolean; error?: string }>
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

// ─── Context ───
const AuthContext = createContext<AuthContextType | null>(null)

// ─── Provider ───
export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        isLoading: true,
        isAuthenticated: false,
    })

    // Fetch current user on mount
    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem("auth_token")
        if (!token) {
            setState({ user: null, isLoading: false, isAuthenticated: false })
            return
        }

        const res = await api.get<{ user: User }>("/auth/me")

        if (res.success && res.data?.user) {
            setState({
                user: res.data.user,
                isLoading: false,
                isAuthenticated: true,
            })
        } else {
            localStorage.removeItem("auth_token")
            setState({ user: null, isLoading: false, isAuthenticated: false })
        }
    }, [])

    useEffect(() => {
        refreshUser()
    }, [refreshUser])

    // ─── Login ───
    const login = useCallback(async (email: string, password: string) => {
        const res = await api.post<{ user: User; token: string }>("/auth/credentials/login", {
            email,
            password,
        })

        if (res.success && res.data) {
            localStorage.setItem("auth_token", res.data.token)
            setState({
                user: res.data.user,
                isLoading: false,
                isAuthenticated: true,
            })
            return { success: true }
        }

        return { success: false, error: res.error || "Login failed" }
    }, [])

    // ─── Signup ───
    const signup = useCallback(async (email: string, password: string, name?: string) => {
        const res = await api.post<{ user: User; token: string }>("/auth/credentials/signup", {
            email,
            password,
            name,
        })

        if (res.success && res.data) {
            localStorage.setItem("auth_token", res.data.token)
            setState({
                user: res.data.user,
                isLoading: false,
                isAuthenticated: true,
            })
            return { success: true }
        }

        return { success: false, error: res.error || "Signup failed" }
    }, [])

    // ─── Google Login ───
    const loginWithGoogle = useCallback(async (credential: string) => {
        const res = await api.post<{ user: User; token: string }>("/auth/google", {
            credential,
        })

        if (res.success && res.data) {
            localStorage.setItem("auth_token", res.data.token)
            setState({
                user: res.data.user,
                isLoading: false,
                isAuthenticated: true,
            })
            return { success: true }
        }

        return { success: false, error: res.error || "Google login failed" }
    }, [])

    // ─── Logout ───
    const logout = useCallback(async () => {
        await api.post("/auth/logout")
        localStorage.removeItem("auth_token")
        setState({ user: null, isLoading: false, isAuthenticated: false })
    }, [])

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                signup,
                loginWithGoogle,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// ─── Hook ───
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
