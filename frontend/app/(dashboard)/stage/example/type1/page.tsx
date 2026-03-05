"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, Heart, Zap, Sparkles, GripVertical, Move } from "lucide-react"
import Link from "next/link"

/* ─── Types ───────────────────────────────────────────────────────── */
interface WordOption {
    id: string
    label: string
}

interface Question {
    id: number
    sentenceParts: string[]
    blanks: { id: string; correctOptionId: string }[]
    options: WordOption[]
}

/* ─── Data ────────────────────────────────────────────────────────── */
const questionsData: Question[] = [
    {
        id: 1,
        sentenceParts: [
            "When the CEO announced his ",
            " resignation, the company entered a period of uncertainty.",
        ],
        blanks: [{ id: "b1", correctOptionId: "w1" }],
        options: [
            { id: "w1", label: "abrupt" },
            { id: "w2", label: "absence" },
            { id: "w3", label: "collapse" },
            { id: "w4", label: "candidate" },
        ],
    },
    {
        id: 2,
        sentenceParts: [
            "The ",
            " was elected after a ",
            " campaign.",
        ],
        blanks: [
            { id: "b2a", correctOptionId: "w5" },
            { id: "b2b", correctOptionId: "w6" },
        ],
        options: [
            { id: "w5", label: "candidate" },
            { id: "w6", label: "controversial" },
            { id: "w7", label: "collapse" },
            { id: "w8", label: "abrupt" },
        ],
    },
    {
        id: 3,
        sentenceParts: [
            "Her ",
            " to helping others was truly inspiring.",
        ],
        blanks: [{ id: "b3", correctOptionId: "w10" }],
        options: [
            { id: "w9", label: "destiny" },
            { id: "w10", label: "devotion" },
            { id: "w11", label: "absence" },
            { id: "w12", label: "controversy" },
        ],
    },
]

/* ─── Draggable Word Chip ─────────────────────────────────────────── */
function WordChip({
    word,
    isUsed,
    disabled,
    onPointerDown,
    isDragging,
}: {
    word: WordOption
    isUsed: boolean
    disabled: boolean
    onPointerDown: (word: WordOption, e: React.PointerEvent) => void
    isDragging: boolean
}) {
    const handlePointerDown = useCallback(
        (e: React.PointerEvent) => {
            if (isUsed || disabled) return
            e.preventDefault()
            onPointerDown(word, e)
        },
        [word, isUsed, disabled, onPointerDown]
    )

    return (
        <motion.div
            layout
            className={`
                relative flex items-center gap-2 rounded-2xl border-2 px-4 py-3 text-[14px] font-semibold
                select-none touch-none
                ${isUsed
                    ? "border-dashed border-muted-foreground/15 bg-transparent text-muted-foreground/30 cursor-default"
                    : isDragging
                        ? "border-primary/40 bg-primary/5 text-primary/40 scale-[0.96] shadow-inner"
                        : "border-border bg-card text-foreground shadow-sm hover:shadow-md hover:border-primary/40 cursor-grab active:cursor-grabbing"
                }
                ${disabled && !isUsed ? "cursor-default opacity-60" : ""}
            `}
            whileHover={!isUsed && !disabled && !isDragging ? { scale: 1.04, y: -2 } : {}}
            onPointerDown={handlePointerDown}
        >
            <GripVertical className={`h-3.5 w-3.5 ${isUsed || isDragging ? "opacity-20" : "opacity-40"}`} />
            {word.label}
        </motion.div>
    )
}

/* ─── Blank Slot ──────────────────────────────────────────────────── */
function BlankSlot({
    blank,
    filledWord,
    isChecked,
    isCorrect,
    onRemove,
    isHovered,
    index,
    slotRef,
}: {
    blank: { id: string; correctOptionId: string }
    filledWord: WordOption | null
    isChecked: boolean
    isCorrect: boolean
    onRemove: () => void
    isHovered: boolean
    index: number
    slotRef: (el: HTMLDivElement | null) => void
}) {
    let borderColor = "border-muted-foreground/20"
    let bgColor = "bg-muted/20"
    let textColor = "text-muted-foreground/40"

    if (isHovered) {
        borderColor = "border-primary"
        bgColor = "bg-primary/10"
    } else if (filledWord && !isChecked) {
        borderColor = "border-primary/50"
        bgColor = "bg-primary/5"
        textColor = "text-primary"
    } else if (isChecked && isCorrect) {
        borderColor = "border-emerald-400"
        bgColor = "bg-emerald-50 dark:bg-emerald-500/10"
        textColor = "text-emerald-600 dark:text-emerald-400"
    } else if (isChecked && !isCorrect) {
        borderColor = "border-red-400"
        bgColor = "bg-red-50 dark:bg-red-500/10"
        textColor = "text-red-600 dark:text-red-400"
    }

    return (
        <div
            ref={slotRef}
            onClick={() => {
                if (!isChecked && filledWord) onRemove()
            }}
            className={`
                inline-flex min-w-[100px] items-center justify-center gap-1.5
                rounded-xl border-2 border-dashed mx-1 px-3 py-1.5
                transition-all duration-200
                ${filledWord && !isChecked ? "cursor-pointer" : ""}
                ${borderColor} ${bgColor}
                ${isHovered ? "ring-4 ring-primary/15 shadow-lg shadow-primary/10 scale-105" : ""}
            `}
        >
            {filledWord ? (
                <motion.span
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 15, stiffness: 300 }}
                    className={`text-[15px] font-bold ${textColor}`}
                >
                    {filledWord.label}
                </motion.span>
            ) : (
                <span className={`text-xs font-medium transition-colors ${isHovered ? "text-primary/60" : "text-muted-foreground/30"}`}>
                    {isHovered ? "Bırak" : index + 1}
                </span>
            )}

            {isChecked && isCorrect && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                </motion.div>
            )}
            {isChecked && !isCorrect && filledWord && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <XCircle className="h-3.5 w-3.5 text-red-500" />
                </motion.div>
            )}
        </div>
    )
}

/* ─── Page ────────────────────────────────────────────────────────── */
export default function Type1Page() {
    const [qi, setQi] = useState(0)
    const [filled, setFilled] = useState<Record<string, WordOption | null>>({})
    const [checked, setChecked] = useState(false)
    const [score, setScore] = useState(0)
    const [lives, setLives] = useState(3)
    const [finished, setFinished] = useState(false)

    // Drag state — use refs for position to avoid re-renders on every pointer move
    const [draggingWord, setDraggingWord] = useState<WordOption | null>(null)
    const [hoveredBlank, setHoveredBlank] = useState<string | null>(null)
    const ghostRef = useRef<HTMLDivElement>(null)
    const blankRefs = useRef<Record<string, HTMLDivElement | null>>({})
    const draggingWordRef = useRef<WordOption | null>(null)
    const hoveredBlankRef = useRef<string | null>(null)
    const rafId = useRef<number>(0)

    const q = questionsData[qi]
    const progress = ((qi + (checked ? 1 : 0)) / questionsData.length) * 100
    const allFilled = q?.blanks.every((b) => filled[b.id] != null)
    const usedIds = new Set(Object.values(filled).filter(Boolean).map((w) => w!.id))

    // Hit-test blank slots — pure function, no state
    const findHoveredBlank = useCallback(
        (clientX: number, clientY: number): string | null => {
            for (const [blankId, el] of Object.entries(blankRefs.current)) {
                if (!el) continue
                const rect = el.getBoundingClientRect()
                const pad = 30
                if (
                    clientX >= rect.left - pad &&
                    clientX <= rect.right + pad &&
                    clientY >= rect.top - pad &&
                    clientY <= rect.bottom + pad
                ) {
                    return blankId
                }
            }
            return null
        },
        []
    )

    // Pointer event handlers — use direct DOM for ghost position
    useEffect(() => {
        if (!draggingWord) return

        draggingWordRef.current = draggingWord

        const handleMove = (e: PointerEvent) => {
            e.preventDefault()
            // Direct DOM update — no React re-render
            if (ghostRef.current) {
                ghostRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
            }

            // Throttle hit-test to rAF
            cancelAnimationFrame(rafId.current)
            rafId.current = requestAnimationFrame(() => {
                const newHovered = findHoveredBlank(e.clientX, e.clientY)
                if (newHovered !== hoveredBlankRef.current) {
                    hoveredBlankRef.current = newHovered
                    setHoveredBlank(newHovered)
                }
            })
        }

        const handleUp = (e: PointerEvent) => {
            cancelAnimationFrame(rafId.current)
            const targetBlank = findHoveredBlank(e.clientX, e.clientY)
            if (targetBlank && draggingWordRef.current) {
                const word = draggingWordRef.current
                setFilled((prev) => {
                    const next = { ...prev }
                    for (const key of Object.keys(next)) {
                        if (next[key]?.id === word.id) {
                            delete next[key]
                        }
                    }
                    next[targetBlank] = word
                    return next
                })
            }
            draggingWordRef.current = null
            hoveredBlankRef.current = null
            setDraggingWord(null)
            setHoveredBlank(null)
        }

        const handleCancel = () => {
            cancelAnimationFrame(rafId.current)
            draggingWordRef.current = null
            hoveredBlankRef.current = null
            setDraggingWord(null)
            setHoveredBlank(null)
        }

        window.addEventListener("pointermove", handleMove, { passive: false })
        window.addEventListener("pointerup", handleUp)
        window.addEventListener("pointercancel", handleCancel)

        return () => {
            cancelAnimationFrame(rafId.current)
            window.removeEventListener("pointermove", handleMove)
            window.removeEventListener("pointerup", handleUp)
            window.removeEventListener("pointercancel", handleCancel)
        }
    }, [draggingWord, findHoveredBlank])

    const handlePointerDown = useCallback(
        (word: WordOption, e: React.PointerEvent) => {
            if (checked) return
            setDraggingWord(word)
            // Set initial ghost position immediately via ref
            requestAnimationFrame(() => {
                if (ghostRef.current) {
                    ghostRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
                }
            })
        },
        [checked]
    )

    const handleRemoveFromBlank = useCallback(
        (blankId: string) => {
            if (checked) return
            setFilled((prev) => {
                const next = { ...prev }
                delete next[blankId]
                return next
            })
        },
        [checked]
    )

    const doCheck = () => {
        if (!allFilled) return
        setChecked(true)
        const allCorrect = q.blanks.every((b) => filled[b.id]?.id === b.correctOptionId)
        if (allCorrect) {
            setScore((s) => s + 10)
        } else {
            setLives((l) => Math.max(0, l - 1))
        }
    }

    const doNext = () => {
        if (qi + 1 >= questionsData.length) return setFinished(true)
        setQi((i) => i + 1)
        setFilled({})
        setChecked(false)
        blankRefs.current = {}
    }

    /* ─── finished ─── */
    if (finished) {
        const pct = Math.round((score / (questionsData.length * 10)) * 100)
        return (
            <div className="flex min-h-[80vh] items-center justify-center px-4">
                <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
                >
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-emerald-500/10 to-transparent" />
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
                        <Link href="/path" className="mt-2 w-full rounded-2xl bg-primary py-3.5 text-center font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:shadow-xl hover:-translate-y-0.5 active:scale-[.98]">
                            Devam Et
                        </Link>
                    </div>
                </motion.div>
            </div>
        )
    }

    /* ─── Build sentence parts with blanks ─── */
    const renderedSentence = () => {
        const els: React.ReactNode[] = []
        q.sentenceParts.forEach((part, pi) => {
            els.push(<span key={`p${pi}`}>{part}</span>)
            if (pi < q.blanks.length) {
                const blank = q.blanks[pi]
                const word = filled[blank.id] ?? null
                const isCorrect = checked && word?.id === blank.correctOptionId
                els.push(
                    <BlankSlot
                        key={blank.id}
                        blank={blank}
                        filledWord={word}
                        isChecked={checked}
                        isCorrect={!!isCorrect}
                        onRemove={() => handleRemoveFromBlank(blank.id)}
                        isHovered={hoveredBlank === blank.id}
                        index={pi}
                        slotRef={(el) => {
                            blankRefs.current[blank.id] = el
                        }}
                    />
                )
            }
        })
        return els
    }

    return (
        <div className="mx-auto flex min-h-[85vh] max-w-lg flex-col px-4 py-5">
            {/* ─── Top bar ─── */}
            <div className="flex items-center gap-3">
                <Link href="/path" className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="relative flex-1 h-4 rounded-full bg-muted overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                    />
                    <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.6 }}
                    />
                </div>
                <div className="flex items-center gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Heart key={i} className={`h-4 w-4 transition-all ${i < lives ? "fill-red-400 text-red-400" : "text-muted-foreground/30"}`} />
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
                        <h2 className="text-xl font-extrabold text-foreground leading-tight">
                            Boşluğa uygun kelimeyi yerleştirin
                        </h2>
                        <p className="mt-1.5 text-[13px] text-muted-foreground flex items-center gap-1.5">
                            <Move className="h-3.5 w-3.5 opacity-60" />
                            Kelimeyi sürükleyip boşluğa bırakın
                        </p>

                        {/* sentence card */}
                        <div className={`relative mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow duration-300 ${draggingWord ? "ring-2 ring-primary/10 shadow-lg" : ""}`}>
                            <p className="text-[17px] font-medium leading-[2.2] text-foreground/90 flex flex-wrap items-center">
                                {renderedSentence()}
                            </p>
                        </div>

                        {/* word bank */}
                        <div className="mt-6">
                            <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-1.5">
                                <GripVertical className="h-3 w-3" />
                                Sürüklenebilir Kelimeler
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                                {q.options.map((w) => (
                                    <WordChip
                                        key={w.id}
                                        word={w}
                                        isUsed={usedIds.has(w.id)}
                                        disabled={checked}
                                        onPointerDown={handlePointerDown}
                                        isDragging={draggingWord?.id === w.id}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex-1" />
                    </motion.div>
                </AnimatePresence>

                {/* ─── Bottom ─── */}
                <div className="mt-6 pb-2">
                    <AnimatePresence>
                        {checked && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 12 }}
                            >
                                {q.blanks.every((b) => filled[b.id]?.id === b.correctOptionId) ? (
                                    <div className="mb-4 flex items-center gap-3 rounded-2xl bg-emerald-100 dark:bg-emerald-500/15 px-5 py-3.5">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
                                            <CheckCircle2 className="h-4 w-4 text-white" />
                                        </div>
                                        <p className="flex-1 text-sm font-bold text-emerald-700 dark:text-emerald-300">Mükemmel!</p>
                                        <span className="text-sm font-bold text-emerald-600">+10 XP</span>
                                    </div>
                                ) : (
                                    <div className="mb-4 flex items-center gap-3 rounded-2xl bg-red-100 dark:bg-red-500/15 px-5 py-3.5">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500">
                                            <XCircle className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-red-700 dark:text-red-300">Doğru cevap:</p>
                                            <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                                                {q.blanks.map((b) => q.options.find((o) => o.id === b.correctOptionId)?.label).join(", ")}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!checked ? (
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={doCheck}
                            disabled={!allFilled}
                            className={`w-full rounded-2xl py-4 text-[15px] font-bold shadow-lg transition-all ${allFilled
                                ? "bg-primary text-primary-foreground shadow-primary/20 hover:shadow-xl"
                                : "bg-muted text-muted-foreground shadow-none cursor-not-allowed"
                                }`}
                        >
                            Kontrol Et
                        </motion.button>
                    ) : (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={doNext}
                            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-bold shadow-lg transition-all ${q.blanks.every((b) => filled[b.id]?.id === b.correctOptionId)
                                ? "bg-emerald-500 text-white shadow-emerald-500/20"
                                : "bg-red-500 text-white shadow-red-500/20"
                                }`}
                        >
                            {qi + 1 >= questionsData.length ? "Bitir" : "Devam Et"}
                            <ChevronRight className="h-4 w-4" />
                        </motion.button>
                    )}
                </div>
            </div>

            {/* ─── Drag Ghost — positioned via direct DOM, not React state ─── */}
            {draggingWord && (
                <div
                    ref={ghostRef}
                    className="fixed top-0 left-0 pointer-events-none z-[100] will-change-transform"
                    style={{ transform: "translate(-9999px, -9999px)" }}
                >
                    <div className="flex items-center gap-2 rounded-2xl border-2 border-primary bg-primary/10 backdrop-blur-sm px-5 py-3.5 text-[15px] font-bold text-primary shadow-2xl shadow-primary/25 ring-4 ring-primary/10">
                        <Move className="h-3.5 w-3.5 opacity-60" />
                        {draggingWord.label}
                    </div>
                </div>
            )}
        </div>
    )
}
