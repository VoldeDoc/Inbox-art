import { type NextRequest, NextResponse } from "next/server"
import { approveArtPiece, getAllActiveSubscribers } from "@/lib/database"
import { sendArtToSubscribers } from "@/lib/postmark"

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const artPiece = await approveArtPiece(id)

    if (!artPiece) {
      return NextResponse.json({ error: "Failed to approve art piece" }, { status: 500 })
    }

    // Send to subscribers when approved
    const subscribers = await getAllActiveSubscribers()
    await sendArtToSubscribers(artPiece, subscribers)

    return NextResponse.json({ success: true, artPiece })
  } catch (error) {
    console.error("Error approving art piece:", error)
    return NextResponse.json({ error: "Failed to approve art piece" }, { status: 500 })
  }
}
