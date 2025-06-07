import { NextResponse } from "next/server"
import { getApprovedArtPieces } from "@/lib/database"

export async function GET() {
  try {
    const artPieces = await getApprovedArtPieces()
    return NextResponse.json(artPieces)
  } catch (error) {
    console.error("Error fetching art pieces:", error)
    return NextResponse.json({ error: "Failed to fetch art pieces" }, { status: 500 })
  }
}
