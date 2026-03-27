import { NextResponse } from "next/server"

export async function GET() {
    try {
        const response = await fetch("https://parrotingo-admin.vercel.app/api/units/summary", {
            cache: 'no-store'
        })

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch from remote" }, { status: response.status })
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("Proxy error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
