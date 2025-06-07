import type { EmailPayload, Subscriber } from "@/types"
import { env } from "./env"

interface DeviceInfo {
  browser: string;
  os: string;
  ip: string;
}

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


export const sendWelcomeEmail = async (email: string, name: string) => {
  console.log('📧 Attempting to send welcome email to:', email, 'Name:', name);

  const subject = '🎨 Welcome to Inbox-as-Art - Your Creative Journey Begins!';
  
  const textBody = `Welcome to Inbox-as-Art, ${name}! 

Thank you for joining our creative community. You can now:
- Turn emails into visual poetry and artwork
- Transform voice messages into captivating stories
- Share your creations on our art wall
- Discover art from other creative minds

Start creating: ${env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}

Welcome aboard!
The Inbox-as-Art Team`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          margin: 0; 
          padding: 20px; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 20px; 
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          padding: 50px 40px; 
          text-align: center; 
          color: white;
          position: relative;
        }
        .header::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 20px solid transparent;
          border-right: 20px solid transparent;
          border-top: 10px solid #764ba2;
        }
        .header h1 { 
          margin: 0 0 15px; 
          font-size: 36px; 
          font-weight: 700;
          text-shadow: 0 3px 6px rgba(0,0,0,0.3);
          letter-spacing: -0.5px;
        }
        .header p {
          opacity: 0.95;
          font-size: 18px;
          font-weight: 300;
          margin: 0;
        }
        .content { 
          padding: 50px 40px; 
          line-height: 1.7; 
          color: #2d3748;
        }
        .welcome-text { 
          font-size: 20px; 
          color: #4a5568; 
          margin-bottom: 25px;
          font-weight: 500;
        }
        .intro-text {
          font-size: 16px;
          line-height: 1.8;
          color: #4a5568;
          margin-bottom: 35px;
        }
        .features { 
          background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%); 
          border-radius: 16px; 
          padding: 35px 30px; 
          margin: 35px 0;
          border: 1px solid #e2e8f0;
        }
        .features h3 {
          margin: 0 0 25px 0; 
          color: #1a202c;
          font-size: 20px;
          font-weight: 600;
          text-align: center;
        }
        .feature { 
          margin: 20px 0;
          padding: 15px 0;
        }
        .feature-icon { 
          width: 50px; 
          height: 50px; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          border-radius: 50%; 
          color: white; 
          font-weight: bold;
          font-size: 20px;
          text-align: center;
          line-height: 50px;
          float: left;
          margin-right: 20px;
          margin-top: 5px;
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
        }
        .feature-text {
          margin-left: 70px;
          padding-top: 12px;
          color: #2d3748;
          font-size: 16px;
          line-height: 1.6;
          font-weight: 500;
        }
        .feature-clear {
          clear: both;
        }
        .cta-section {
          text-align: center;
          margin: 40px 0;
          padding: 30px 0;
        }
        .cta-text {
          font-size: 18px;
          color: #4a5568;
          margin-bottom: 25px;
          font-weight: 500;
        }
        .cta-button { 
          display: inline-block; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 18px 35px; 
          text-decoration: none; 
          border-radius: 50px; 
          font-weight: 600; 
          font-size: 16px;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5);
        }
        .pro-tip {
          background: #f7fafc;
          border-left: 4px solid #667eea;
          padding: 20px 25px;
          margin: 35px 0;
          border-radius: 0 12px 12px 0;
        }
        .pro-tip p {
          margin: 0;
          color: #4a5568;
          font-size: 15px;
          line-height: 1.6;
        }
        .pro-tip strong {
          color: #667eea;
        }
        .footer { 
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); 
          padding: 40px 40px; 
          text-align: center; 
          color: #64748b; 
          border-top: 1px solid #e2e8f0;
        }
        .footer-brand {
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 8px;
        }
        .footer-team {
          font-size: 16px;
          color: #4a5568;
          margin-bottom: 20px;
        }
        .footer-help {
          font-size: 14px;
          color: #64748b;
          line-height: 1.5;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 600px) {
          body { padding: 10px; }
          .container { border-radius: 16px; }
          .header, .content, .footer { padding: 30px 25px; }
          .header h1 { font-size: 28px; }
          .features { padding: 25px 20px; }
          .feature-icon { width: 45px; height: 45px; line-height: 45px; font-size: 18px; }
          .feature-text { margin-left: 65px; }
          .cta-button { padding: 16px 30px; font-size: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎨 Welcome to Inbox-as-Art!</h1>
          <p>Your creative journey starts now</p>
        </div>
        
        <div class="content">
          <p class="welcome-text">Hi <strong>${name}</strong>,</p>
          <p class="intro-text">We're absolutely thrilled to have you join our creative community! You've just unlocked a world where your everyday emails and voice messages transform into beautiful, AI-generated art.</p>
          
          <div class="features">
            <h3>✨ What you can create</h3>
            <div class="feature">
              <div class="feature-icon">📧</div>
              <div class="feature-text">Turn your emails into stunning visual poetry and artwork</div>
              <div class="feature-clear"></div>
            </div>
            <div class="feature">
              <div class="feature-icon">🎙️</div>
              <div class="feature-text">Transform voice messages into captivating stories and images</div>
              <div class="feature-clear"></div>
            </div>
            <div class="feature">
              <div class="feature-icon">🖼️</div>
              <div class="feature-text">Share your creations on our beautiful community art wall</div>
              <div class="feature-clear"></div>
            </div>
            <div class="feature">
              <div class="feature-icon">✨</div>
              <div class="feature-text">Discover and get inspired by art from other creative minds</div>
              <div class="feature-clear"></div>
            </div>
          </div>

          <div class="cta-section">
            <p class="cta-text">Ready to start your creative journey? Your first masterpiece is just one email or voice message away!</p>
            <a href="${env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" class="cta-button">
              Start Creating Art Now! 🚀
            </a>
          </div>

          <div class="pro-tip">
            <p><strong>💡 Pro tip:</strong> Try sending an email about your day or record a voice message about something that inspires you - watch the magic happen as our AI transforms your words into beautiful art!</p>
          </div>
        </div>
        
        <div class="footer">
          <p class="footer-brand">Welcome aboard the creative express! 🎨</p>
          <p class="footer-team">The Inbox-as-Art Team</p>
          <p class="footer-help">If you have any questions, feel free to reach out. We're here to help you create amazing art!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const result = await sendEmail(email, subject, textBody, htmlBody);
    console.log('✅ Welcome email sent successfully to:', email);
    return { success: true, result };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: 'Failed to send welcome email' };
  }
};



export const sendSecurityAlert = async (email: string, name: string, deviceInfo: DeviceInfo) => {
  console.log('📧 Attempting to send security alert to:', email, 'Device:', deviceInfo);

  const loginTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const subject = '🔒 Security Alert: New Device Login Detected';
  
  const textBody = `🔒 SECURITY ALERT - New Device Login

Hi ${name},

We detected a login to your Inbox-as-Art account from a new device:

Browser: ${deviceInfo.browser}
OS: ${deviceInfo.os}
IP: ${deviceInfo.ip}
Time: ${loginTime}

If this was you, you can ignore this email.

If this wasn't you, please:
- Change your password immediately
- Review your account activity
- Contact support at support@inbox-as-art.com

Secure your account: ${env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/security

The Inbox-as-Art Security Team`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          margin: 0; 
          padding: 0; 
          background-color: #f8fafc;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 12px; 
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
          padding: 30px; 
          text-align: center; 
          color: white;
        }
        .header h1 { 
          margin: 0; 
          font-size: 24px; 
          font-weight: 600;
        }
        .content { 
          padding: 30px; 
          line-height: 1.6; 
          color: #374151;
        }
        .alert-box { 
          background: #fef2f2; 
          border: 1px solid #fecaca; 
          border-radius: 8px; 
          padding: 20px; 
          margin: 20px 0;
        }
        .device-info { 
          background: #f9fafb; 
          border-radius: 8px; 
          padding: 20px; 
          margin: 20px 0;
        }
        .info-item { 
          display: flex; 
          justify-content: space-between; 
          padding: 8px 0; 
          border-bottom: 1px solid #e5e7eb;
        }
        .info-item:last-child { 
          border-bottom: none;
        }
        .info-label { 
          font-weight: 600; 
          color: #4b5563;
        }
        .info-value { 
          color: #1f2937;
        }
        .action-buttons { 
          text-align: center; 
          margin: 25px 0;
        }
        .secure-button { 
          display: inline-block; 
          background: #dc2626; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 6px; 
          font-weight: 600; 
          margin: 0 10px;
        }
        .contact-button { 
          display: inline-block; 
          background: #6b7280; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 6px; 
          font-weight: 600; 
          margin: 0 10px;
        }
        .footer { 
          background: #f9fafb; 
          padding: 20px; 
          text-align: center; 
          color: #6b7280; 
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔒 Security Alert</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${name}</strong>,</p>
          
          <div class="alert-box">
            <p style="margin: 0; font-weight: 600; color: #dc2626;">
              ⚠️ We detected a login to your Inbox-as-Art account from a new device.
            </p>
          </div>

          <p>If this was you, you can safely ignore this email. If you don't recognize this login, please take action immediately to secure your account.</p>

          <div class="device-info">
            <h3 style="margin-top: 0; color: #1f2937;">Login Details:</h3>
            <div class="info-item">
              <span class="info-label">🌐 Browser:</span>
              <span class="info-value">${deviceInfo.browser}</span>
            </div>
            <div class="info-item">
              <span class="info-label">💻 Operating System:</span>
              <span class="info-value">${deviceInfo.os}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📍 IP Address:</span>
              <span class="info-value">${deviceInfo.ip}</span>
            </div>
            <div class="info-item">
              <span class="info-label">🕐 Time:</span>
              <span class="info-value">${loginTime}</span>
            </div>
          </div>

          <p><strong>If this wasn't you:</strong></p>
          <ul>
            <li>Change your password immediately</li>
            <li>Review your account for any unauthorized activity</li>
            <li>Consider enabling two-factor authentication</li>
            <li>Contact our support team if you need assistance</li>
          </ul>

          <div class="action-buttons">
            <a href="${env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/security" class="secure-button">
              Secure My Account
            </a>
            <a href="mailto:support@inbox-as-art.com" class="contact-button">
              Contact Support
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 25px;">
            <strong>Security Tip:</strong> We'll always send security alerts from this email address. Never click links in suspicious emails claiming to be from us.
          </p>
        </div>
        <div class="footer">
          <p>This is an automated security notification from Inbox-as-Art.</p>
          <p>If you have questions about this alert, please contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const result = await sendEmail(email, subject, textBody, htmlBody);
    console.log('✅ Security alert sent successfully to:', email);
    return { success: true, result };
  } catch (error) {
    console.error('❌ Error sending security alert:', error);
    return { success: false, error: 'Failed to send security alert' };
  }
};