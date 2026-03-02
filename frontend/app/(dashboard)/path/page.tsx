"use client"

import Link from "next/link"
import { PathNode } from "@/components/ui/path-node"

const pathNodes = [
    { id: 1, status: "completed" as const, label: "Merhaba!" },
    { id: 2, status: "completed" as const, label: "Nasılsın?" },
    { id: 3, status: "current" as const, label: "BAŞLA" },
    { id: 4, status: "locked" as const, label: "" },
    { id: 5, status: "locked" as const, label: "" },
    { id: 6, status: "locked" as const, label: "" },
    { id: 7, status: "chest" as const, label: "" },
]

export default function PathPage() {
    return (
        <div className="space-y-6">
            <div className="mx-auto max-w-md">
                {/* Path header */}
                <div className="mb-8 rounded-2xl bg-blue-500 p-4 text-white">
                    <Link href="/" className="mb-1 text-sm text-white/80 hover:text-white flex items-center gap-1">
                        ← BÖLÜM 1, KISIM 1
                    </Link>
                    <h2 className="text-xl font-bold">Temel Selamlaşma</h2>
                </div>

                {/* Duolingo-style path nodes */}
                <div className="flex flex-col items-center gap-4">
                    {pathNodes.map((node, index) => (
                        <PathNode
                            key={node.id}
                            status={node.status}
                            label={node.label}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
