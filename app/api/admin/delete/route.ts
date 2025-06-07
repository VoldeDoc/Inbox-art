import { type NextRequest, NextResponse } from "next/server"
import { deleteArtPiece } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const success = await deleteArtPiece(id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete art piece" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting art piece:", error)
    return NextResponse.json({ error: "Failed to delete art piece" }, { status: 500 })
  }
}
