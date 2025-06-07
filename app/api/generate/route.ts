import { type NextRequest, NextResponse } from "next/server"
import { generateContent } from "@/lib/ai"
import { uploadImageToBlob } from "@/lib/blob"
import { addArtPiece, getAllActiveSubscribers } from "@/lib/database"
import { sendArtToSubscribers } from "@/lib/postmark"
import type { ContentType } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const { content, type, email = "voice@inbox-as-art.com" } = await request.json()

    if (!content || !type) {
      return NextResponse.json({ error: "Content and type are required" }, { status: 400 })
    }

    // Generate content based on the input
    const generatedContent = await generateContent(content, type as ContentType)

    let imageUrl: string | null = null

    // If it's an image, upload to Vercel Blob
    if (type === "image") {
      const filename = `voice-art-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.png`
      imageUrl = await uploadImageToBlob(generatedContent, filename)
    }

    // Store the generated content
    const artPiece = await addArtPiece({
      type: type as ContentType,
      content: type === "image" ? `AI-generated artwork from voice: ${content}` : generatedContent,
      image_url: imageUrl,
      source_email: email,
      approved: true,
      anonymous: false,
    })

    if (artPiece) {
      // Send to subscribers
      const subscribers = await getAllActiveSubscribers()
      await sendArtToSubscribers(artPiece, subscribers)
    }

    return NextResponse.json({
      success: true,
      artPiece,
      generatedContent: type === "image" ? imageUrl : generatedContent,
    })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
