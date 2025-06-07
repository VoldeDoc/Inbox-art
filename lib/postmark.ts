import type { EmailPayload, Subscriber } from "@/types"
import { env } from "./env"

export async function parsePostmarkWebhook(body: any): Promise<EmailPayload> {
  return {
    subject: body.Subject || "No subject",
    textBody: body.TextBody || body.HtmlBody?.replace(/<[^>]*>/g, "") || "",
    htmlBody: body.HtmlBody || "",
    from: body.From || "",
    to: body.To || "",
    messageId: body.MessageID || Math.random().toString(36).substring(2, 9),
  }
}

export async function sendEmail(to: string, subject: string, textBody: string, htmlBody?: string) {
  try {
    const response = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": env.POSTMARK_SERVER_TOKEN,
      },
      body: JSON.stringify({
        From: env.POSTMARK_FROM_EMAIL,
        To: to,
        Subject: subject,
        TextBody: textBody,
        HtmlBody: htmlBody || textBody,
        TrackOpens: true,
        TrackLinks: "HtmlAndText",
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Postmark API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log(`Email sent successfully to ${to}:`, result.MessageID)
    return result
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

export async function sendArtToSubscribers(artPiece: any, subscribers: Subscriber[]) {
  console.log(`Sending art piece to ${subscribers.length} subscribers`)

  const promises = subscribers.map(async (subscriber) => {
    const preferences = subscriber.preferences || {}

    // Check if subscriber wants this type of content
    const wantsThisType =
      (artPiece.type === "poem" && preferences.receive_poems !== false) ||
      (artPiece.type === "story" && preferences.receive_stories !== false) ||
      (artPiece.type === "image" && preferences.receive_images !== false)

    if (!wantsThisType) {
      console.log(`Skipping ${subscriber.email} - doesn't want ${artPiece.type}`)
      return
    }

    const subject = `✨ New ${artPiece.type} from Inbox-as-Art`
    const textBody = `Hello ${subscriber.name || "Art Lover"},

A new ${artPiece.type} has been created from an email:

${artPiece.content}

View more art: ${env.NEXT_PUBLIC_APP_URL}/wall

---
Unsubscribe: ${env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(subscriber.email)}
`

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New ${artPiece.type} from Inbox-as-Art</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Source+Sans+Pro:wght@300;400;600&display=swap');
    
    body { 
      font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      max-width: 650px; 
      margin: 0 auto; 
      padding: 0;
      background-color: #f9f9f9;
    }
    
    .email-container {
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.05);
      margin: 20px;
      overflow: hidden;
    }
    
    .header { 
      text-align: center; 
      padding: 35px 30px 20px;
      background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
      color: white;
    }
    
    .header h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 28px;
      margin: 0 0 15px;
      letter-spacing: 0.5px;
    }
    
    .header p {
      opacity: 0.9;
      margin: 0;
      font-weight: 300;
      font-size: 18px;
    }
    
    .content { 
      background: white; 
      padding: 30px; 
      border-radius: 0;
    }
    
    .art-container {
      padding: 25px;
      border-radius: 8px;
      background-color: #f8f9fa;
      border: 1px solid #eaeaea;
      margin: 10px 0 25px;
    }
    
    .poem { 
      font-family: 'Playfair Display', Georgia, serif; 
      font-style: italic; 
      white-space: pre-line;
      font-size: 18px;
      line-height: 1.8;
      color: #444;
      padding: 10px 15px;
      border-left: 3px solid #6a11cb;
    }
    
    .story { 
      line-height: 1.8;
      font-size: 16px;
      color: #333;
      padding: 5px 0;
    }
    
    .image { 
      text-align: center;
    }
    
    .image img { 
      max-width: 100%; 
      height: auto; 
      border-radius: 8px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    }
    
    .image p {
      margin-top: 15px;
      font-style: italic;
      color: #666;
    }
    
    .footer { 
      text-align: center; 
      padding: 25px 30px 35px;
      background-color: #f8f9fa;
      border-top: 1px solid #eaeaea;
    }
    
    .view-more-btn {
      display: inline-block;
      background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
      color: white;
      text-decoration: none;
      padding: 12px 25px;
      border-radius: 50px;
      font-weight: 600;
      margin: 5px 0 20px;
      transition: transform 0.2s ease;
    }
    
    .view-more-btn:hover {
      transform: translateY(-2px);
    }
    
    .footer p { 
      margin: 10px 0;
      color: #666;
      font-size: 14px;
    }
    
    .footer a { 
      color: #2575fc;
      text-decoration: none;
    }
    
    .footer a:hover {
      text-decoration: underline;
    }
    
    .divider {
      height: 1px;
      background-color: #eaeaea;
      margin: 20px 0;
    }
    
    .art-type-badge {
      display: inline-block;
      background-color: rgba(106, 17, 203, 0.1);
      color: #6a11cb;
      padding: 5px 12px;
      border-radius: 50px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 15px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>✨ Art Delivered to Your Inbox</h1>
      <p>Hello ${subscriber.name || "Art Lover"},</p>
    </div>
    
    <div class="content">
      <div class="art-type-badge">${artPiece.type}</div>
      
      <div class="art-container">
        ${
          artPiece.type === "image" && artPiece.image_url
            ? `<div class="image">
                 <img src="${artPiece.image_url}" alt="${artPiece.content}" />
                 <p><em>${artPiece.content}</em></p>
               </div>`
            : artPiece.type === "poem"
              ? `<div class="poem">${artPiece.content}</div>`
              : `<div class="story">${artPiece.content}</div>`
        }
      </div>
      
      <div style="text-align: center;">
        <a href="${env.NEXT_PUBLIC_APP_URL}/wall" class="view-more-btn">View More Art</a>
      </div>
    </div>
    
    <div class="footer">
      <p>Inbox-as-Art transforms everyday emails into creative expressions</p>
      <div class="divider"></div>
      <p><small>Don't want to receive these emails? <a href="${env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(subscriber.email)}">Unsubscribe</a></small></p>
    </div>
  </div>
</body>
</html>
    `

    try {
      await sendEmail(subscriber.email, subject, textBody, htmlBody)
      console.log(`✅ Sent to ${subscriber.email}`)
    } catch (error) {
      console.error(`❌ Failed to send to ${subscriber.email}:`, error)
    }
  })

  const results = await Promise.allSettled(promises)
  const successful = results.filter((r) => r.status === "fulfilled").length
  const failed = results.filter((r) => r.status === "rejected").length

  console.log(`Email delivery complete: ${successful} successful, ${failed} failed`)
}

// Test Postmark connection
export async function testPostmarkConnection() {
  try {
    const response = await fetch("https://api.postmarkapp.com/server", {
      headers: {
        Accept: "application/json",
        "X-Postmark-Server-Token": env.POSTMARK_SERVER_TOKEN,
      },
    })

    if (!response.ok) {
      throw new Error(`Postmark API error: ${response.status}`)
    }

    return { success: true, message: "Postmark connection successful" }
  } catch (error) {
    return { success: false, message: `Postmark connection failed: ${error}` }
  }
}