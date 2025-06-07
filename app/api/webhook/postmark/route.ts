import { type NextRequest, NextResponse } from "next/server"
import { parsePostmarkWebhook, sendArtToSubscribers } from "@/lib/postmark"
import { generateContent } from "@/lib/ai"
import { uploadImageToBlob } from "@/lib/blob"
import { addArtPiece, getAllActiveSubscribers } from "@/lib/database"
import type { ContentType } from "@/types"

export async function POST(request: NextRequest) {
  console.log("📧 Received Postmark webhook")

  try {
    const body = await request.json()
    console.log("Webhook payload:", {
      subject: body.Subject,
      from: body.From,
      to: body.To,
    })

    // Parse the Postmark webhook payload
    const email = await parsePostmarkWebhook(body)

    if (!email.textBody.trim()) {
      console.log("⚠️ Empty email body, skipping")
      return NextResponse.json({ success: true, message: "Empty email body" })
    }

    // Generate content for each type randomly
    const contentTypes: ContentType[] = ["poem", "story", "image"]
    const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)]

    console.log(`🎨 Generating ${randomType} from email content`)

    // Generate content based on the email body
    const content = await generateContent(email.textBody, randomType)
    console.log(`✅ Generated ${randomType}:`, content.substring(0, 100) + "...")

    let imageUrl: string | null = null

    // If it's an image, upload to Vercel Blob
    if (randomType === "image") {
      console.log("📸 Uploading image to blob storage")
      const filename = `art-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.png`
      imageUrl = await uploadImageToBlob(content, filename)
      console.log("✅ Image uploaded:", imageUrl)
    }

    // Store the generated content
    const artPiece = await addArtPiece({
      type: randomType,
      content: randomType === "image" ? `AI-generated artwork from: ${email.subject}` : content,
      image_url: imageUrl,
      source_email: email.from,
      approved: true, // Auto-approve for now
      anonymous: false,
    })

    if (!artPiece) {
      throw new Error("Failed to save art piece to database")
    }

    console.log("💾 Art piece saved to database:", artPiece.id)

    // Send to subscribers
    try {
      const subscribers = await getAllActiveSubscribers()
      console.log(`📬 Sending to ${subscribers.length} subscribers`)

      if (subscribers.length > 0) {
        await sendArtToSubscribers(artPiece, subscribers)
      }
    } catch (error) {
      console.error("Error sending to subscribers:", error)
      // Don't fail the whole request if email sending fails
    }

    return NextResponse.json({
      success: true,
      artPiece: {
        id: artPiece.id,
        type: artPiece.type,
        content: artPiece.content.substring(0, 100) + "...",
      },
    })
  } catch (error) {
    console.error("❌ Error processing webhook:", error)
    return NextResponse.json(
      {
        error: "Failed to process webhook",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
