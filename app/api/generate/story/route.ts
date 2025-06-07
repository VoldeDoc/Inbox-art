import { type NextRequest, NextResponse } from "next/server"
import { generateStory } from "@/lib/ai"

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const story = await generateStory(content)
    return NextResponse.json({ story })
  } catch (error) {
    console.error("Error generating story:", error)
    return NextResponse.json({ error: "Failed to generate story" }, { status: 500 })
  }
}
