"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Star, Trophy, Loader2, Lock } from "lucide-react"
import { PathNode } from "@/components/ui/path-node"
import { Skeleton } from "@/components/ui/skeleton"

interface Unit {
    ünite: number
    name: string
    questions: number
    id: string
}

interface FlattenedNode {
    id: string
    type: "question" | "chest"
    status: "completed" | "current" | "locked" | "chest"
    label: string
    unitNumber: number
    questionNumber?: number
}

export default function PathPage() {
    const [units, setUnits] = useState<Unit[]>([])
    const [loading, setLoading] = useState(true)
    const [activeNodeId, setActiveNodeId] = useState<string | null>(null)

    useEffect(() => {
        async function fetchUnits() {
            try {
                const response = await fetch("/api/units/summary")
                if (!response.ok) throw new Error("Failed to fetch units")
                const data = await response.json()
                setUnits(data)
            } catch (error) {
                console.error("Error fetching units:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchUnits()
    }, [])

    // Global click listener to close tipbox
    useEffect(() => {
        const handleGlobalClick = () => {
            setActiveNodeId(null)
        }
        window.addEventListener("click", handleGlobalClick)
        return () => window.removeEventListener("click", handleGlobalClick)
    }, [])

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="mx-auto max-w-md">
                    <Skeleton className="mb-8 h-24 w-full rounded-2xl" />
                    <div className="flex flex-col items-center gap-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-16 w-16 rounded-full" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // Progress calculation
    let totalQuestionsCount = 0
    let currentFound = false
    const allNodes: FlattenedNode[] = []

    units.forEach((unit) => {
        for (let i = 1; i <= unit.questions; i++) {
            totalQuestionsCount++

            let status: "completed" | "current" | "locked" = "locked"
            if (totalQuestionsCount < 3) {
                status = "completed"
            } else if (!currentFound) {
                status = "current"
                currentFound = true
            }

            allNodes.push({
                id: `${unit.id}-q-${i}`,
                type: "question",
                status: status,
                label: status === "current" ? "BAŞLA" : "",
                unitNumber: unit.ünite,
                questionNumber: i
            })
        }
        // Add a trophy/chest at the end of each unit
        allNodes.push({
            id: `${unit.id}-trophy`,
            type: "chest",
            status: "locked",
            label: "",
            unitNumber: unit.ünite
        })
    })

    return (
        <div className="space-y-12 pb-20">
            {units.map((unit) => {
                const unitNodes = allNodes.filter(n => n.unitNumber === unit.ünite)

                return (
                    <div key={unit.id} className="mx-auto max-w-md">
                        {/* Unit header */}
                        <div className="mb-8 rounded-2xl bg-blue-500 p-6 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
                            <h2 className="text-xl font-bold">Ünite {unit.ünite} : {unit.name}</h2>
                        </div>

                        {/* Path nodes for this unit */}
                        <div className="flex flex-col items-center gap-6">
                            {unitNodes.map((node, index) => (
                                <PathNode
                                    key={node.id}
                                    status={node.status}
                                    label={node.label}
                                    index={index}
                                    unitNumber={node.unitNumber}
                                    questionNumber={node.questionNumber}
                                    isActive={activeNodeId === node.id}
                                    onToggle={() => setActiveNodeId(activeNodeId === node.id ? null : node.id)}
                                />
                            ))}
                        </div>
                    </div>
                )
            })}

            {units.length === 0 && (
                <div className="text-center py-20 text-muted-foreground font-medium">
                    Henüz eğitim içeriği bulunmamaktadır.
                </div>
            )}
        </div>
    )
}
