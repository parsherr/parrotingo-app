"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

const words = [
    { word: "abandon", en: "To leave someone or something permanently, especially when you should not.", tr: "Birini ya da bir şeyi kalıcı olarak terk etmek; bırakıp gitmek." },
    { word: "abrupt", en: "Sudden and unexpected, often in a way that seems rude or surprising.", tr: "Ani ve beklenmedik; bazen kaba ya da şaşırtıcı şekilde gerçekleşen." },
    { word: "absence", en: "The fact of not being in a place where you are expected to be.", tr: "Bulunması gereken bir yerde olmama durumu; yokluk." },
    { word: "basis", en: "The main reason, idea, or foundation that something is built on.", tr: "Bir şeyin dayandığı temel, esas veya ana neden." },
    { word: "candidate", en: "A person who applies for a job, position, or takes part in an election.", tr: "Bir iş, pozisyon ya da seçim için başvuran kişi; aday." },
    { word: "collapse", en: "A sudden failure or breakdown of a system, organization, or structure.", tr: "Bir sistemin, yapının ya da kurumun ani çöküşü." },
    { word: "controversy", en: "A serious public disagreement or discussion about something.", tr: "Kamuoyunda ciddi fikir ayrılığı veya tartışma." },
    { word: "devote", en: "To give most of your time, energy, or attention to something.", tr: "Zamanını, enerjini ya da dikkatini bir şeye adamak." },
    { word: "destiny", en: "The belief that certain events are meant to happen and cannot be changed.", tr: "Önceden belirlenmiş olduğuna inanılan kader; yazgı." },
    { word: "desperately", en: "In a way that shows great need, urgency, or hopelessness.", tr: "Büyük bir ihtiyaç, çaresizlik veya aciliyet içinde; umutsuzca." },
]

export default function WordbankPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredWords = words.filter(
        (word) =>
            word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
            word.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
            word.tr.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold">Kelimelerim</h2>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Kelime veya tanım ara..."
                        className="rounded-2xl pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-2xl border overflow-hidden bg-background">
                {/* Table header */}
                <div className="grid grid-cols-[auto,1fr,2fr,2fr] gap-4 border-b bg-muted/30 px-6 py-4 text-sm font-semibold text-muted-foreground">
                    <span className="w-8">#</span>
                    <span>Kelime</span>
                    <span>İngilizce Tanım</span>
                    <span>Türkçe Tanım</span>
                </div>

                {/* Word rows */}
                <div className="divide-y divide-border/50">
                    {filteredWords.map((word, index) => {
                        const originalIndex = words.findIndex(w => w.word === word.word);
                        const rowNumber = originalIndex + 1;

                        return (
                            <motion.div
                                key={word.word}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ backgroundColor: "hsl(var(--muted) / 0.3)" }}
                                className="grid grid-cols-[auto,1fr,2fr,2fr] gap-4 items-start px-6 py-5 transition-colors"
                            >
                                <div className="w-8 flex justify-center pt-1 text-sm font-medium text-muted-foreground">
                                    {rowNumber}
                                </div>
                                <div className="font-bold text-lg text-foreground tracking-tight">
                                    {word.word}
                                </div>
                                <div className="text-sm text-foreground/90 leading-relaxed font-medium">
                                    <span className="text-[10px] font-bold text-muted-foreground block mb-1 uppercase tracking-wider">English</span>
                                    {word.en}
                                </div>
                                <div className="text-sm text-foreground/80 leading-relaxed italic">
                                    <span className="text-[10px] font-bold text-muted-foreground block mb-1 uppercase tracking-wider not-italic">Turkish</span>
                                    {word.tr}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredWords.length === 0 && (
                    <div className="px-6 py-12 text-center text-muted-foreground">
                        <p className="text-lg font-medium">Sonuç bulunamadı</p>
                        <p className="text-sm">Farklı bir arama terimi deneyebilirsiniz.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
