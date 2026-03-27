"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

interface Word {
    id: string
    word: string
    turkishDefinition: string
    englishDefinition: string
    category: string
}

export default function WordbankPage() {
    const [words, setWords] = useState<Word[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        async function fetchWords() {
            try {
                const response = await fetch("/api/words")
                if (!response.ok) throw new Error("Failed to fetch words")
                const data = await response.json()
                setWords(data)
            } catch (error) {
                console.error("Error fetching words:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchWords()
    }, [])

    const filteredWords = words.filter(
        (word) =>
            word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
            word.englishDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
            word.turkishDefinition.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-4 max-w-4xl mx-auto pb-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Kelimelerim</h2>
                    <p className="text-sm text-muted-foreground mt-1">Sistemdeki tüm kayıtlı kelimeler ve tanımları.</p>
                </div>
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Hızlı arama yap..."
                        className="rounded-2xl pl-9 h-11 shadow-sm border-muted-foreground/20 focus-visible:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-[24px] border-[3px] border-black overflow-hidden bg-[#e5e1da] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                {/* Table header */}
                <div className="grid grid-cols-[1fr,2fr,2fr] md:grid-cols-[180px,1fr,1fr] gap-4 bg-[#1a2333] px-8 py-4 text-[13px] font-bold text-white uppercase tracking-[0.1em] border-b-[3px] border-black">
                    <span>WORD</span>
                    <span>DEFINITION</span>
                    <span className="hidden md:block">TURKISH DEFINITION</span>
                </div>

                {/* Word rows */}
                <div className="divide-y-[2px] divide-black/10 md:divide-y-[3px] md:divide-black">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className={`grid grid-cols-[180px,1fr,1fr] gap-4 px-8 py-5 items-center ${i % 2 === 0 ? "bg-[#e5e1da]" : "bg-[#dcd7cc]"}`}>
                                <Skeleton className="h-6 w-32 rounded bg-black/10" />
                                <Skeleton className="h-4 w-full rounded bg-black/5" />
                                <Skeleton className="h-4 w-full rounded bg-black/5" />
                            </div>
                        ))
                    ) : filteredWords.length > 0 ? (
                        filteredWords.map((word, index) => {
                            return (
                                <motion.div
                                    key={word.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.02 }}
                                    className={`grid grid-cols-1 md:grid-cols-[180px,1fr,1fr] gap-x-8 gap-y-2 items-center px-8 py-5 transition-colors ${index % 2 === 0 ? "bg-[#e5e1da]" : "bg-[#dcd7cc]"}`}
                                >
                                    {/* Word */}
                                    <div className="font-bold text-[17px] text-black tracking-tight">
                                        {word.word}
                                    </div>

                                    {/* English Definition */}
                                    <div className="text-[14px] text-black/60 italic leading-snug font-medium pr-4">
                                        <span className="md:hidden text-[10px] font-bold text-black/40 block mb-1 uppercase not-italic">DEFINITION</span>
                                        {word.englishDefinition}
                                    </div>

                                    {/* Turkish Definition */}
                                    <div className="text-[14px] text-black/80 leading-snug font-medium">
                                        <span className="md:hidden text-[10px] font-bold text-black/40 block mb-1 uppercase">TURKISH DEFINITION</span>
                                        {word.turkishDefinition}
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="px-8 py-20 text-center text-black/40 bg-[#e5e1da]">
                            <p className="text-sm font-bold uppercase tracking-widest">NO RESULTS FOUND</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
