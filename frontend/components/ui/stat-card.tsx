"use client"

import { Card } from "@/components/ui/card"

interface StatCardProps {
    label: string
    value: string
    icon: React.ReactNode
}

export function StatCard({ label, value, icon }: StatCardProps) {
    return (
        <Card className="rounded-2xl p-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                {icon}
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </Card>
    )
}
