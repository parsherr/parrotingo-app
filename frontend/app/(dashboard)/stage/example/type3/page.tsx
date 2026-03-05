"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, Sparkles, Heart, Zap } from "lucide-react"
import Link from "next/link"

/* ─── Data ────────────────────────────────────────────────────────── */
interface Question {
    id: number
    sentence: string
    options: { label: string; value: string }[]
    correctAnswer: string
}

const questions: Question[] = [
    {
        id: 1,
        sentence: "The sudden ____ of the bridge caused panic among the residents.",
        options: [
            { label: "A", value: "controversy" },
            { label: "B", value: "collapse" },
            { label: "C", value: "destiny" },
            { label: "D", value: "absence" },
        ],
        correctAnswer: "collapse",
    },
    {
        id: 2,
        sentence: "She showed great ____ in completing the marathon despite her injury.",
        options: [
            { label: "A", value: "absence" },
            { label: "B", value: "controversy" },
            { label: "C", value: "determination" },
            { label: "D", value: "collapse" },
        ],
        correctAnswer: "determination",
    },
    {
        id: 3,
        sentence: "The ____ between the two nations lasted for decades.",
        options: [
            { label: "A", value: "candidate" },
            { label: "B", value: "conflict" },
            { label: "C", value: "destiny" },
            { label: "D", value: "devotion" },
        ],
        correctAnswer: "conflict",
    },
]

/* ─── Page ────────────────────────────────────────────────────────── */
export default function Type3Page() {
    const [qi, setQi] = useState(0)
    const [selected, setSelected] = useState<string | null>(null)
    const [checked, setChecked] = useState(false)
    const [score, setScore] = useState(0)
    const [lives, setLives] = useState(3)
    const [finished, setFinished] = useState(false)

    const q = questions[qi]
    const correct = selected === q?.correctAnswer
    const progress = ((qi + (checked ? 1 : 0)) / questions.length) * 100

    const parts = q?.sentence.split("____") ?? ["", ""]

    const doCheck = () => {
        if (!selected) return
        setChecked(true)
        if (selected === q.correctAnswer) {
            setScore((s) => s + 10)
        } else {
            setLives((l) => Math.max(0, l - 1))
        }
    }

    const doNext = () => {
        if (qi + 1 >= questions.length) return setFinished(true)
        setQi((i) => i + 1)
        setSelected(null)
        setChecked(false)
    }

    /* ─── finished screen ─── */
    if (finished) {
        const pct = Math.round((score / (questions.length * 10)) * 100)
        return (
            <div className="flex min-h-[80vh] items-center justify-center px-4">
                <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
                >
                    {/* decorative gradient top */}
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/10 to-transparent" />

                    <div className="relative flex flex-col items-center gap-5 px-8 py-10 text-center">
                        <motion.div
                            animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-4xl shadow-lg shadow-amber-300/30"
                        >
                            🏆
                        </motion.div>

                        <div>
                            <h2 className="text-2xl font-extrabold text-foreground">Ders Tamamlandı!</h2>
                            <p className="mt-1 text-sm text-muted-foreground">Harika iş çıkardın</p>
                        </div>

                        {/* stats */}
                        <div className="flex w-full gap-3">
                            {[
                                { icon: <Zap className="h-4 w-4" />, label: "XP", value: `+${score}`, color: "text-amber-500" },
                                { icon: <Sparkles className="h-4 w-4" />, label: "Doğruluk", value: `%${pct}`, color: "text-emerald-500" },
                                { icon: <Heart className="h-4 w-4" />, label: "Can", value: `${lives}/3`, color: "text-red-400" },
                            ].map((s) => (
                                <div key={s.label} className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-muted/60 py-3">
                                    <span className={s.color}>{s.icon}</span>
                                    <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
                                    <span className="text-[11px] text-muted-foreground">{s.label}</span>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/path"
                            className="mt-2 w-full rounded-2xl bg-primary py-3.5 text-center font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:shadow-xl hover:-translate-y-0.5 active:scale-[.98]"
                        >
                            Devam Et
                        </Link>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="mx-auto flex min-h-[85vh] max-w-lg flex-col px-4 py-5">
            {/* ─── Top bar ─── */}
            <div className="flex items-center gap-3">
                <Link
                    href="/path"
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>

                {/* progress */}
                <div className="relative flex-1 h-4 rounded-full bg-muted overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-blue-400"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                    />
                    {/* shimmer */}
                    <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.6 }}
                    />
                </div>

                {/* lives */}
                <div className="flex items-center gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Heart
                            key={i}
                            className={`h-4 w-4 transition-all ${i < lives ? "fill-red-400 text-red-400" : "text-muted-foreground/30"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* ─── Question ─── */}
            <div className="mt-8 flex flex-1 flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.35 }}
                        className="flex flex-1 flex-col"
                    >
                        {/* instruction */}
                        <h2 className="text-xl font-extrabold text-foreground leading-tight">
                            Doğru kelimeyi seçin
                        </h2>
                        <p className="mt-1.5 text-[13px] text-muted-foreground">
                            Cümledeki boşluğa uygun kelimeyi işaretleyin.
                        </p>

                        {/* sentence card */}
                        <div className="relative mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
                            <p className="text-[17px] font-medium leading-relaxed text-foreground/90">
                                {parts[0]}
                                <span
                                    className={`
                                        mx-0.5 inline-block min-w-[90px] border-b-[3px] pb-0.5 text-center font-bold transition-all
                                        ${checked && correct
                                            ? "border-emerald-400 text-emerald-600 dark:text-emerald-400"
                                            : checked && !correct
                                                ? "border-red-400 text-red-600 dark:text-red-400"
                                                : selected
                                                    ? "border-primary text-primary"
                                                    : "border-muted-foreground/25 text-muted-foreground/40"
                                        }
                                    `}
                                >
                                    {checked && !correct ? q.correctAnswer : selected ?? ""}
                                </span>
                                {parts[1]}
                            </p>
                        </div>

                        {/* ─── Options ─── */}
                        <div className="mt-6 grid grid-cols-1 gap-2.5">
                            {q.options.map((opt, idx) => {
                                const isSel = selected === opt.value
                                const isCorr = opt.value === q.correctAnswer
                                const isWrong = checked && isSel && !isCorr

                                // Determine style
                                let ring = "border-border"
                                let bg = "bg-card hover:bg-muted/40"
                                let labelBg = "bg-muted text-muted-foreground"
                                let textColor = "text-foreground"

                                if (checked) {
                                    if (isCorr) {
                                        ring = "border-emerald-400 dark:border-emerald-500"
                                        bg = "bg-emerald-50 dark:bg-emerald-500/10"
                                        labelBg = "bg-emerald-500 text-white"
                                        textColor = "text-emerald-700 dark:text-emerald-300"
                                    } else if (isWrong) {
                                        ring = "border-red-400 dark:border-red-500"
                                        bg = "bg-red-50 dark:bg-red-500/10"
                                        labelBg = "bg-red-500 text-white"
                                        textColor = "text-red-700 dark:text-red-300"
                                    } else {
                                        bg = "bg-card opacity-40"
                                    }
                                } else if (isSel) {
                                    ring = "border-primary ring-[3px] ring-primary/15"
                                    bg = "bg-primary/5"
                                    labelBg = "bg-primary text-primary-foreground"
                                    textColor = "text-foreground"
                                }

                                return (
                                    <motion.button
                                        key={opt.value}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.06, duration: 0.25 }}
                                        onClick={() => !checked && setSelected(opt.value)}
                                        disabled={checked}
                                        className={`
                                            group flex items-center gap-3.5 rounded-2xl border-2 p-3.5 text-left transition-all
                                            ${ring} ${bg}
                                            ${!checked ? "cursor-pointer active:scale-[.98]" : "cursor-default"}
                                        `}
                                    >
                                        {/* letter badge */}
                                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors ${labelBg}`}>
                                            {opt.label}
                                        </span>

                                        {/* word */}
                                        <span className={`flex-1 text-[15px] font-semibold ${textColor}`}>
                                            {opt.value}
                                        </span>

                                        {/* result icon */}
                                        {checked && isCorr && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}>
                                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                            </motion.div>
                                        )}
                                        {isWrong && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}>
                                                <XCircle className="h-5 w-5 text-red-500" />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                )
                            })}
                        </div>

                        {/* spacer */}
                        <div className="flex-1" />
                    </motion.div>
                </AnimatePresence>

                {/* ─── Bottom feedback + CTA ─── */}
                <div className="mt-6 pb-2">
                    <AnimatePresence>
                        {checked && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 12 }}
                                className={`mb-4 flex items-center gap-3 rounded-2xl px-5 py-3.5 ${correct
                                        ? "bg-emerald-100 dark:bg-emerald-500/15"
                                        : "bg-red-100 dark:bg-red-500/15"
                                    }`}
                            >
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${correct ? "bg-emerald-500" : "bg-red-500"}`}>
                                    {correct ? <CheckCircle2 className="h-4 w-4 text-white" /> : <XCircle className="h-4 w-4 text-white" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-bold ${correct ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>
                                        {correct ? "Mükemmel!" : "Doğru cevap:"}
                                    </p>
                                    {!correct && (
                                        <p className="text-sm font-semibold text-red-600 dark:text-red-400">{q.correctAnswer}</p>
                                    )}
                                </div>
                                {correct && <span className="text-sm font-bold text-emerald-600">+10 XP</span>}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!checked ? (
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={doCheck}
                            disabled={!selected}
                            className={`
                                w-full rounded-2xl py-4 text-[15px] font-bold shadow-lg transition-all
                                ${selected
                                    ? "bg-primary text-primary-foreground shadow-primary/20 hover:shadow-xl active:shadow-md"
                                    : "bg-muted text-muted-foreground shadow-none cursor-not-allowed"
                                }
                            `}
                        >
                            Kontrol Et
                        </motion.button>
                    ) : (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={doNext}
                            className={`
                                flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-bold shadow-lg transition-all
                                ${correct
                                    ? "bg-emerald-500 text-white shadow-emerald-500/20"
                                    : "bg-red-500 text-white shadow-red-500/20"
                                }
                            `}
                        >
                            {qi + 1 >= questions.length ? "Bitir" : "Devam Et"}
                            <ChevronRight className="h-4 w-4" />
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    )
}
