import * as postmark from 'postmark';

// Only initialize client if token exists
const client = process.env.POSTMARK_API_TOKEN 
  ? new postmark.ServerClient(process.env.POSTMARK_API_TOKEN)
  : null;

interface DeviceInfo {
  browser: string;
  os: string;
  ip: string;
}

export const sendWelcomeEmail = async (email: string, name: string) => {
  // Skip email sending if no client configured
  if (!client) {
    console.log('📧 Welcome email would be sent to:', email, 'Name:', name);
    return { success: true, message: 'Email service disabled in development' };
  }

  try {
    await client.sendEmail({
      From: process.env.FROM_EMAIL || 'noreply@inbox-as-art.com',
      To: email,
      Subject: '🎨 Welcome to Inbox-as-Art - Your Creative Journey Begins!',
      HtmlBody: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 0; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: white; 
              border-radius: 16px; 
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              padding: 40px 30px; 
              text-align: center; 
              color: white;
            }
            .header h1 { 
              margin: 0; 
              font-size: 32px; 
              font-weight: 700;
              text-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .content { 
              padding: 40px 30px; 
              line-height: 1.6; 
              color: #333;
            }
            .welcome-text { 
              font-size: 18px; 
              color: #4a5568; 
              margin-bottom: 20px;
            }
            .features { 
              background: #f8fafc; 
              border-radius: 12px; 
              padding: 25px; 
              margin: 25px 0;
            }
            .feature { 
              display: flex; 
              align-items: center; 
              margin: 15px 0;
            }
            .feature-icon { 
              width: 40px; 
              height: 40px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              margin-right: 15px; 
              color: white; 
              font-weight: bold;
            }
            .cta-button { 
              display: inline-block; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 15px 30px; 
              text-decoration: none; 
              border-radius: 8px; 
              font-weight: 600; 
              margin: 20px 0;
              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            }
            .footer { 
              background: #f1f5f9; 
              padding: 25px; 
              text-align: center; 
              color: #64748b; 
              border-top: 1px solid #e2e8f0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎨 Welcome to Inbox-as-Art!</h1>
            </div>
            <div class="content">
              <p class="welcome-text">Hi <strong>${name}</strong>,</p>
              <p>We're absolutely thrilled to have you join our creative community! You've just unlocked a world where your everyday emails and voice messages transform into beautiful, AI-generated art.</p>
              
              <div class="features">
                <h3 style="margin-top: 0; color: #1a202c;">What you can create:</h3>
                <div class="feature">
                  <div class="feature-icon">📧</div>
                  <div>Turn your emails into stunning visual poetry and artwork</div>
                </div>
                <div class="feature">
                  <div class="feature-icon">🎙️</div>
                  <div>Transform voice messages into captivating stories and images</div>
                </div>
                <div class="feature">
                  <div class="feature-icon">🖼️</div>
                  <div>Share your creations on our beautiful art wall</div>
                </div>
                <div class="feature">
                  <div class="feature-icon">✨</div>
                  <div>Discover art from other creative minds in our community</div>
                </div>
              </div>

              <p>Ready to start your creative journey? Your first masterpiece is just one email or voice message away!</p>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" class="cta-button">
                  Start Creating Art Now! 🚀
                </a>
              </div>

              <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
                💡 <strong>Pro tip:</strong> Try sending an email about your day or record a voice message about something that inspires you - watch the magic happen!
              </p>
            </div>
            <div class="footer">
              <p>Welcome aboard the creative express! 🎨</p>
              <p style="margin: 5px 0;">The Inbox-as-Art Team</p>
              <p style="font-size: 12px; margin-top: 15px;">
                If you have any questions, feel free to reach out. We're here to help you create amazing art!
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      TextBody: `Welcome to Inbox-as-Art, ${name}! 

Thank you for joining our creative community. You can now:
- Turn emails into visual poetry and artwork
- Transform voice messages into captivating stories
- Share your creations on our art wall
- Discover art from other creative minds

Start creating: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}

Welcome aboard!
The Inbox-as-Art Team`
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: 'Failed to send welcome email' };
  }
};

export const sendSecurityAlert = async (email: string, name: string, deviceInfo: DeviceInfo) => {
  // Skip email sending if no client configured
  if (!client) {
    console.log('📧 Security alert would be sent to:', email, 'Device:', deviceInfo);
    return { success: true, message: 'Email service disabled in development' };
  }

  const loginTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  try {
    await client.sendEmail({
      From: process.env.FROM_EMAIL || 'security@inbox-as-art.com',
      To: email,
      Subject: '🔒 Security Alert: New Device Login Detected',
      HtmlBody: `
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
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/security" class="secure-button">
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
      `,
      TextBody: `🔒 SECURITY ALERT - New Device Login

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

Secure your account: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/security

The Inbox-as-Art Security Team`
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending security alert:', error);
    return { success: false, error: 'Failed to send security alert' };
  }
};