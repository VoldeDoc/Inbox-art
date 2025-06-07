import { type NextRequest, NextResponse } from "next/server"
import { unsubscribe } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const success = await unsubscribe(email)

    if (!success) {
      return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unsubscribing:", error)
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 })
  }
}
