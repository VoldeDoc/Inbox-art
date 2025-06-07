import { type NextRequest, NextResponse } from "next/server"
import { generatePoem } from "@/lib/ai"

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const poem = await generatePoem(content)
    return NextResponse.json({ poem })
  } catch (error) {
    console.error("Error generating poem:", error)
    return NextResponse.json({ error: "Failed to generate poem" }, { status: 500 })
  }
}
