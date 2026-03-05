"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, Heart, Zap, Sparkles, Lightbulb, GripVertical, Move } from "lucide-react"
import Link from "next/link"

/* ─── Types ───────────────────────────────────────────────────────── */
interface DefinitionCard {
    id: string
    definition: string
    definitionTr: string
    correctAnswer: string
}

interface AnswerOption {
    id: string
    label: string
}

interface Question {
    id: number
    definitions: DefinitionCard[]
    options: AnswerOption[]
}

/* ─── Data ────────────────────────────────────────────────────────── */
const questionsData: Question[] = [
    {
        id: 1,
        definitions: [
            {
                id: "d1",
                definition: "A sudden failure or breakdown of a system, organization, or structure.",
                definitionTr: "Bir sistemin, organizasyonun veya yapının ani çöküşü veya bozulması.",
                correctAnswer: "collapse",
            },
        ],
        options: [
            { id: "o1", label: "collapse" },
            { id: "o2", label: "candidate" },
            { id: "o3", label: "devote" },
        ],
    },
    {
        id: 2,
        definitions: [
            {
                id: "d2a",
                definition: "A person who applies for a job or is nominated for election.",
                definitionTr: "Bir işe başvuran veya seçim için aday gösterilen kişi.",
                correctAnswer: "candidate",
            },
            {
                id: "d2b",
                definition: "The state of being away from a place or person.",
                definitionTr: "Bir yerden veya kişiden uzakta olma durumu.",
                correctAnswer: "absence",
            },
        ],
        options: [
            { id: "o4", label: "candidate" },
            { id: "o5", label: "absence" },
            { id: "o6", label: "collapse" },
            { id: "o7", label: "controversy" },
        ],
    },
    {
        id: 3,
        definitions: [
            {
                id: "d3a",
                definition: "To give all or a large part of one's time or resources to a person, activity, or cause.",
                definitionTr: "Zamanının veya kaynaklarının tamamını ya da büyük bölümünü bir kişiye, faaliyete veya amaca adamak.",
                correctAnswer: "devote",
            },
            {
                id: "d3b",
                definition: "The events that will necessarily happen to a particular person or thing in the future.",
                definitionTr: "Belirli bir kişinin veya şeyin gelecekte kaçınılmaz olarak başına gelecek olaylar.",
                correctAnswer: "destiny",
            },
        ],
        options: [
            { id: "o8", label: "devote" },
            { id: "o9", label: "destiny" },
            { id: "o10", label: "abrupt" },
            { id: "o11", label: "conflict" },
        ],
    },
]

/* ─── Draggable Word Chip ─────────────────────────────────────────── */
function WordChip({
    opt,
    isUsed,
    disabled,
    onPointerDown,
    isDragging,
}: {
    opt: AnswerOption
    isUsed: boolean
    disabled: boolean
    onPointerDown: (opt: AnswerOption, e: React.PointerEvent) => void
    isDragging: boolean
}) {
    const handlePointerDown = useCallback(
        (e: React.PointerEvent) => {
            if (isUsed || disabled) return
            e.preventDefault()
            onPointerDown(opt, e)
        },
        [opt, isUsed, disabled, onPointerDown]
    )

    return (
        <motion.div
            layout
            className={`
                flex items-center gap-2 rounded-2xl border-2 px-4 py-3 text-[14px] font-semibold
                select-none touch-none
                ${isUsed
                    ? "border-dashed border-muted-foreground/15 bg-transparent text-muted-foreground/30 cursor-default"
                    : isDragging
                        ? "border-amber-400/40 bg-amber-50/30 dark:bg-amber-500/5 text-amber-700/40 dark:text-amber-300/40 scale-[0.96] shadow-inner"
                        : "border-border bg-card text-foreground shadow-sm hover:shadow-md hover:border-amber-400/40 cursor-grab active:cursor-grabbing"
                }
                ${disabled && !isUsed ? "opacity-50 cursor-default" : ""}
            `}
            whileHover={!isUsed && !disabled && !isDragging ? { scale: 1.04, y: -2 } : {}}
            onPointerDown={handlePointerDown}
        >
            <GripVertical className={`h-3.5 w-3.5 ${isUsed || isDragging ? "opacity-20" : "opacity-40"}`} />
            {opt.label}
        </motion.div>
    )
}

/* ─── Page ────────────────────────────────────────────────────────── */
export default function Type2Page() {
    const [qi, setQi] = useState(0)
    const [matched, setMatched] = useState<Record<string, string | null>>({})
    const [checked, setChecked] = useState(false)
    const [score, setScore] = useState(0)
    const [lives, setLives] = useState(3)
    const [finished, setFinished] = useState(false)
    const [helpOpen, setHelpOpen] = useState<Record<string, boolean>>({})

    // Drag state — refs for performance
    const [draggingOpt, setDraggingOpt] = useState<AnswerOption | null>(null)
    const [hoveredDef, setHoveredDef] = useState<string | null>(null)
    const ghostRef = useRef<HTMLDivElement>(null)
    const defRefs = useRef<Record<string, HTMLDivElement | null>>({})
    const draggingOptRef = useRef<AnswerOption | null>(null)
    const hoveredDefRef = useRef<string | null>(null)
    const rafId = useRef<number>(0)

    const q = questionsData[qi]
    const progress = ((qi + (checked ? 1 : 0)) / questionsData.length) * 100
    const usedLabels = new Set(Object.values(matched).filter(Boolean) as string[])
    const allFilled = q?.definitions.every((d) => matched[d.id] != null)
    const allCorrect = checked && q?.definitions.every((d) => matched[d.id] === d.correctAnswer)

    // Hit-test definition drop zones
    const findHoveredDef = useCallback(
        (clientX: number, clientY: number): string | null => {
            for (const [defId, el] of Object.entries(defRefs.current)) {
                if (!el) continue
                const rect = el.getBoundingClientRect()
                const pad = 20
                if (
                    clientX >= rect.left - pad &&
                    clientX <= rect.right + pad &&
                    clientY >= rect.top - pad &&
                    clientY <= rect.bottom + pad
                ) {
                    return defId
                }
            }
            return null
        },
        []
    )

    // Pointer event handlers — direct DOM for ghost
    useEffect(() => {
        if (!draggingOpt) return

        draggingOptRef.current = draggingOpt

        const handleMove = (e: PointerEvent) => {
            e.preventDefault()
            if (ghostRef.current) {
                ghostRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
            }

            cancelAnimationFrame(rafId.current)
            rafId.current = requestAnimationFrame(() => {
                const newHovered = findHoveredDef(e.clientX, e.clientY)
                if (newHovered !== hoveredDefRef.current) {
                    hoveredDefRef.current = newHovered
                    setHoveredDef(newHovered)
                }
            })
        }

        const handleUp = (e: PointerEvent) => {
            cancelAnimationFrame(rafId.current)
            const targetDef = findHoveredDef(e.clientX, e.clientY)
            if (targetDef && draggingOptRef.current) {
                const opt = draggingOptRef.current
                setMatched((prev) => {
                    const next = { ...prev }
                    for (const key of Object.keys(next)) {
                        if (next[key] === opt.label) {
                            delete next[key]
                        }
                    }
                    next[targetDef] = opt.label
                    return next
                })
            }
            draggingOptRef.current = null
            hoveredDefRef.current = null
            setDraggingOpt(null)
            setHoveredDef(null)
        }

        const handleCancel = () => {
            cancelAnimationFrame(rafId.current)
            draggingOptRef.current = null
            hoveredDefRef.current = null
            setDraggingOpt(null)
            setHoveredDef(null)
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
    }, [draggingOpt, findHoveredDef])

    const handlePointerDown = useCallback(
        (opt: AnswerOption, e: React.PointerEvent) => {
            if (checked) return
            setDraggingOpt(opt)
            requestAnimationFrame(() => {
                if (ghostRef.current) {
                    ghostRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
                }
            })
        },
        [checked]
    )

    const handleRemoveFromDef = useCallback(
        (defId: string) => {
            if (checked) return
            setMatched((prev) => {
                const next = { ...prev }
                delete next[defId]
                return next
            })
        },
        [checked]
    )

    const doCheck = () => {
        if (!allFilled) return
        setChecked(true)
        const correct = q.definitions.every((d) => matched[d.id] === d.correctAnswer)
        if (correct) {
            setScore((s) => s + 10)
        } else {
            setLives((l) => Math.max(0, l - 1))
        }
    }

    const doNext = () => {
        if (qi + 1 >= questionsData.length) return setFinished(true)
        setQi((i) => i + 1)
        setMatched({})
        setChecked(false)
        defRefs.current = {}
    }

    /* ─── Finished ─── */
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
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-amber-500/10 to-transparent" />
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

    return (
        <div className="mx-auto flex min-h-[85vh] max-w-lg flex-col px-4 py-5">
            {/* ─── Top bar ─── */}
            <div className="flex items-center gap-3">
                <Link href="/path" className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="relative flex-1 h-4 rounded-full bg-muted overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
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

            {/* ─── Body ─── */}
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
                            Tanıma uygun kelimeyi eşleştirin
                        </h2>
                        <p className="mt-1.5 text-[13px] text-muted-foreground flex items-center gap-1.5">
                            <Move className="h-3.5 w-3.5 opacity-60" />
                            Kelimeyi sürükleyip tanım kartına bırakın
                        </p>

                        {/* Definition cards */}
                        <div className="mt-6 space-y-4">
                            {q.definitions.map((def, idx) => {
                                const val = matched[def.id]
                                const isCorrect = checked && val === def.correctAnswer
                                const isWrong = checked && val != null && val !== def.correctAnswer
                                const isEmpty = !val
                                const isTarget = hoveredDef === def.id
                                const isHelpVisible = helpOpen[def.id] ?? false

                                return (
                                    <motion.div
                                        key={def.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.08 }}
                                    >
                                        <div
                                            ref={(el) => {
                                                defRefs.current[def.id] = el
                                            }}
                                            onClick={() => {
                                                if (!checked && val) handleRemoveFromDef(def.id)
                                            }}
                                            className={`
                                                rounded-2xl p-4 transition-colors
                                                ${val && !checked ? "cursor-pointer" : ""}
                                                ${isTarget ? "bg-amber-50/40 dark:bg-amber-500/5" : ""}
                                                ${isCorrect ? "bg-emerald-50/40 dark:bg-emerald-500/5" : ""}
                                                ${isWrong ? "bg-red-50/40 dark:bg-red-500/5" : ""}
                                            `}
                                        >
                                            {/* definition text + help button */}
                                            <div className="flex items-start gap-3 mb-3 w-full">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setHelpOpen((prev) => ({
                                                            ...prev,
                                                            [def.id]: !prev[def.id],
                                                        }))
                                                    }}
                                                    className={`
                                                        mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg
                                                        transition-all duration-200 active:scale-90
                                                        ${isHelpVisible
                                                            ? "bg-amber-500 shadow-md shadow-amber-500/20"
                                                            : "bg-amber-100 dark:bg-amber-500/20 hover:bg-amber-200 dark:hover:bg-amber-500/30"
                                                        }
                                                    `}
                                                    title="Türkçe çeviriyi göster"
                                                >
                                                    <Lightbulb className={`h-3.5 w-3.5 transition-colors ${isHelpVisible ? "text-white" : "text-amber-600 dark:text-amber-400"}`} />
                                                </button>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[15px] leading-relaxed text-foreground/80 italic">
                                                        &ldquo;{def.definition}&rdquo;
                                                    </p>
                                                    <AnimatePresence>
                                                        {isHelpVisible && (
                                                            <motion.p
                                                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                                animate={{ opacity: 1, height: "auto", marginTop: 6 }}
                                                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="text-[13px] text-amber-600 dark:text-amber-400 font-medium overflow-hidden"
                                                            >
                                                                💡 {def.definitionTr}
                                                            </motion.p>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>

                                            {/* drop zone */}
                                            <div
                                                className={`
                                                    flex items-center justify-center rounded-xl border-2 border-dashed
                                                    py-3.5 px-5 min-h-[52px] transition-all w-full
                                                    ${isEmpty && !isTarget ? "border-muted-foreground/15 bg-muted/20" : ""}
                                                    ${isTarget ? "border-amber-400/60 bg-amber-50/80 dark:bg-amber-500/10" : ""}
                                                    ${val && !checked ? "border-solid border-primary/30 bg-primary/5" : ""}
                                                    ${isCorrect ? "border-solid border-emerald-400/50 bg-emerald-100/50 dark:bg-emerald-500/15" : ""}
                                                    ${isWrong ? "border-solid border-red-400/50 bg-red-100/50 dark:bg-red-500/15" : ""}
                                                `}
                                            >
                                                {val ? (
                                                    <div className="flex items-center gap-2">
                                                        <motion.span
                                                            initial={{ scale: 0.7, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            transition={{ type: "spring", damping: 15 }}
                                                            className={`text-[15px] font-bold ${isCorrect
                                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                                    : isWrong
                                                                        ? "text-red-600 dark:text-red-400"
                                                                        : "text-primary"
                                                                }`}
                                                        >
                                                            {val}
                                                        </motion.span>
                                                        {isCorrect && (
                                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                            </motion.div>
                                                        )}
                                                        {isWrong && (
                                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                                <XCircle className="h-4 w-4 text-red-500" />
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className={`text-[13px] transition-colors ${isTarget ? "text-amber-500/60" : "text-muted-foreground/30"}`}>
                                                        {isTarget ? "Buraya bırakın" : "Kelimeyi sürükleyin"}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Show correct answer if wrong */}
                                            {isWrong && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                                                    className="text-[13px] text-red-500 dark:text-red-400"
                                                >
                                                    Doğru: <span className="font-bold">{def.correctAnswer}</span>
                                                </motion.p>
                                            )}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* ─── Word bank ─── */}
                        <div className="mt-6">
                            <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-1.5">
                                <GripVertical className="h-3 w-3" />
                                Sürüklenebilir Kelimeler
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                                {q.options.map((opt) => (
                                    <WordChip
                                        key={opt.id}
                                        opt={opt}
                                        isUsed={usedLabels.has(opt.label)}
                                        disabled={checked}
                                        onPointerDown={handlePointerDown}
                                        isDragging={draggingOpt?.id === opt.id}
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
                                {allCorrect ? (
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
                                        <p className="flex-1 text-sm font-bold text-red-700 dark:text-red-300">
                                            Bazı eşleştirmeler yanlış!
                                        </p>
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
                            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-bold shadow-lg transition-all ${allCorrect
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

            {/* ─── Drag Ghost — positioned via direct DOM, cursor-centered ─── */}
            {draggingOpt && (
                <div
                    ref={ghostRef}
                    className="fixed top-0 left-0 pointer-events-none z-[100] will-change-transform"
                    style={{ transform: "translate(-9999px, -9999px)" }}
                >
                    <div className="flex items-center gap-2 rounded-2xl border-2 border-amber-500 bg-amber-50/90 dark:bg-amber-500/15 backdrop-blur-sm px-5 py-3.5 text-[15px] font-bold text-amber-700 dark:text-amber-300 shadow-2xl shadow-amber-500/25 ring-4 ring-amber-500/10">
                        <Move className="h-3.5 w-3.5 opacity-60" />
                        {draggingOpt.label}
                    </div>
                </div>
            )}
        </div>
    )
}
