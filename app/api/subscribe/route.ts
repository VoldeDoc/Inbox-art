import { type NextRequest, NextResponse } from "next/server"
import { addSubscriber, getSubscriber } from "@/lib/database"
import { sendEmail } from "@/lib/postmark"
import { env } from "@/lib/env"

export async function POST(request: NextRequest) {
  try {
    const { email, name, preferences } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if subscriber already exists
    const existingSubscriber = await getSubscriber(email)
    if (existingSubscriber) {
      return NextResponse.json({ error: "Email already subscribed" }, { status: 400 })
    }

    // Add new subscriber
    const subscriber = await addSubscriber({
      email,
      name,
      active: true,
      preferences: preferences || {
        receive_poems: true,
        receive_stories: true,
        receive_images: true,
        frequency: "daily",
      },
    })

    if (!subscriber) {
      return NextResponse.json({ error: "Failed to add subscriber" }, { status: 500 })
    }

    // Send welcome email
    let emailSent = false;
    try {
      const welcomeSubject = "Welcome to Inbox-as-Art!";
      const welcomeTextBody = `Hello ${name || "Art Lover"},

Thank you for subscribing to Inbox-as-Art!

You'll now receive beautiful AI-generated ${getContentTypes(preferences)} directly in your inbox.

You can update your preferences or unsubscribe at any time by visiting:
${env.NEXT_PUBLIC_APP_URL}/preferences?email=${encodeURIComponent(email)}

Enjoy your art journey!
`;

      const welcomeHtmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Inbox-as-Art</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      max-width: 650px; 
      margin: 0 auto; 
      padding: 0;
    }
    
    .email-container {
      background-color: #ffffff;
      border-radius: 8px;
      border: 1px solid #eaeaea;
      margin: 20px;
      overflow: hidden;
    }
    
    .header { 
      text-align: center; 
      padding: 30px 20px 15px;
      background: #6a11cb;
      color: white;
    }
    
    .header h1 {
      font-size: 24px;
      margin: 0 0 10px;
    }
    
    .content { 
      padding: 20px; 
    }
    
    .welcome-message {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .preferences-list {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 15px;
      margin: 15px 0;
      border: 1px solid #eaeaea;
    }
    
    .preferences-list ul {
      padding-left: 20px;
    }
    
    .footer { 
      text-align: center; 
      padding: 20px;
      background-color: #f8f9fa;
      border-top: 1px solid #eaeaea;
    }
    
    .preferences-btn {
      display: inline-block;
      background-color: #6a11cb;
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 4px;
      font-weight: 600;
      margin: 5px 0 15px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>✨ Welcome to Inbox-as-Art</h1>
      <p>Hello ${name || "Art Lover"},</p>
    </div>
    
    <div class="content">
      <div class="welcome-message">
        <h2>Thank you for subscribing!</h2>
        <p>You're now part of our creative community. Get ready to receive beautiful AI-generated art directly in your inbox.</p>
      </div>
      
      <div class="preferences-list">
        <h3>Your Subscription Includes:</h3>
        <ul>
          ${preferences?.receive_poems ? '<li>Poems - Captivating verses that speak to the soul</li>' : ''}
          ${preferences?.receive_stories ? '<li>Stories - Imaginative tales that transport you elsewhere</li>' : ''}
          ${preferences?.receive_images ? '<li>Images - Visual art created by AI from textual prompts</li>' : ''}
        </ul>
      </div>
      
      <div style="text-align: center;">
        <p>You can update your preferences or unsubscribe at any time</p>
        <a href="${env.NEXT_PUBLIC_APP_URL}/preferences?email=${encodeURIComponent(email)}" class="preferences-btn">Manage Preferences</a>
      </div>
    </div>
    
    <div class="footer">
      <p>Inbox-as-Art transforms everyday emails into creative expressions</p>
      <p><small>Don't want to receive these emails? <a href="${env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe</a></small></p>
    </div>
  </div>
</body>
</html>
      `;

      await sendEmail(email, welcomeSubject, welcomeTextBody, welcomeHtmlBody);
      console.log(`✅ Welcome email sent to ${email}`);
      emailSent = true;
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      // Continue with the response but indicate email wasn't sent
    }

    return NextResponse.json({ 
      success: true, 
      subscriber,
      emailSent,
      message: "Thanks for subscribing! " + 
        (emailSent ? "Check your inbox for a welcome message." : "We'll send art to your inbox soon.")
    })
  } catch (error) {
    console.error("Error adding subscriber:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}

// Helper function to generate a string of content types based on preferences
function getContentTypes(preferences: any): string {
  const types = [];
  if (preferences?.receive_poems) types.push("poems");
  if (preferences?.receive_stories) types.push("stories");
  if (preferences?.receive_images) types.push("images");
  
  if (types.length === 0) return "art";
  if (types.length === 1) return types[0];
  if (types.length === 2) return `${types[0]} and ${types[1]}`;
  return `${types.slice(0, -1).join(", ")}, and ${types[types.length - 1]}`;
}