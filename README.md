# 🎨 Inbox-as-Art

Transform your emails into beautiful AI-generated poetry, stories, and images. A complete application with voice input, email integration, and subscription features.

## ✨ Features

- **Email Integration**: Receive emails via Postmark webhooks and transform them into art
- **Voice Input**: Speak your message and transform it into poems, stories, or images
- **AI Generation**: Uses OpenAI for text and Fal AI for image generation
- **Live Art Wall**: Browse and search generated content in real-time
- **Subscription System**: Users can subscribe to receive art pieces via email
- **Admin Dashboard**: Content moderation and approval system
- **Image Storage**: Automatic upload to Vercel Blob storage

## 🚀 Quick Setup

### 1. Environment Variables

Create a `.env.local` file in your project root with these variables:

\`\`\`env
# Supabase (Database)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI (Text Generation)
OPENAI_API_KEY=sk-your-openai-api-key

# Fal AI (Image Generation)
FAL_API_KEY=your-fal-api-key

# Postmark (Email Service)
POSTMARK_SERVER_TOKEN=your-postmark-server-token
POSTMARK_FROM_EMAIL=noreply@yourdomain.com

# Vercel Blob (Image Storage)
BLOB_READ_WRITE_TOKEN=your-blob-read-write-token

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 2. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the following SQL to create the required tables:

\`\`\`sql
-- Create the art_pieces table
CREATE TABLE IF NOT EXISTS art_pieces (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(10) NOT NULL CHECK (type IN ('poem', 'story', 'image')),
    content TEXT NOT NULL,
    image_url TEXT,
    source_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved BOOLEAN DEFAULT FALSE,
    anonymous BOOLEAN DEFAULT FALSE,
    metadata JSONB
);

-- Create the subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    active BOOLEAN DEFAULT TRUE,
    preferences JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_art_pieces_approved ON art_pieces(approved);
CREATE INDEX IF NOT EXISTS idx_art_pieces_created_at ON art_pieces(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_art_pieces_type ON art_pieces(type);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_active ON subscribers(active);

-- Enable Row Level Security (RLS)
ALTER TABLE art_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to approved art pieces
CREATE POLICY "Public can view approved art pieces" ON art_pieces
    FOR SELECT USING (approved = true);

-- Create policies for insert
CREATE POLICY "Anyone can insert art pieces" ON art_pieces
    FOR INSERT WITH CHECK (true);

-- Create policies for subscribers
CREATE POLICY "Anyone can subscribe" ON subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own subscription" ON subscribers
    FOR UPDATE USING (true);
\`\`\`

### 3. Service Setup

#### OpenAI
1. Get your API key from [platform.openai.com](https://platform.openai.com)
2. Add it to your environment variables as `OPENAI_API_KEY`

#### Fal AI
1. Sign up at [fal.ai](https://fal.ai)
2. Get your API key from the dashboard
3. Add it to your environment variables as `FAL_API_KEY`

#### Postmark
1. Sign up at [postmarkapp.com](https://postmarkapp.com)
2. Create a server and get your server token
3. Set up a webhook pointing to `https://your-domain.com/api/webhook/postmark`
4. Add your server token and from email to environment variables

#### Vercel Blob
1. Deploy to Vercel or use Vercel CLI
2. Enable Blob storage in your Vercel project
3. Get your read/write token from the Vercel dashboard
4. Add it to your environment variables as `BLOB_READ_WRITE_TOKEN`

### 4. Deploy

#### Local Development
\`\`\`bash
npm install
npm run dev
\`\`\`

#### Production (Vercel)
1. Connect your GitHub repository to Vercel
2. Add all environment variables in the Vercel dashboard
3. Deploy!

## 🔧 Health Check

Visit `/admin` after deployment to see the system health check. This will verify all your integrations are working correctly.

## 📧 Email Setup

### Postmark Webhook Configuration
1. In your Postmark server settings, add a webhook
2. Set the URL to: `https://your-domain.com/api/webhook/postmark`
3. Enable "Inbound" webhook type
4. Test by sending an email to your configured inbound email address

### Email Flow
1. User sends email to your Postmark inbound address
2. Postmark forwards to your webhook
3. AI generates poem, story, or image
4. Content is saved to database
5. Subscribers receive the art via email

## 🎯 Usage

### Voice Input
1. Visit the homepage
2. Click the microphone button or type in the text area
3. Choose poem, story, or image
4. Click "Transform to Art"

### Email Integration
1. Send an email to your configured Postmark address
2. The system automatically generates art from your email
3. Art appears on the wall and is sent to subscribers

### Subscription
1. Users can subscribe on the homepage
2. They receive new art pieces via email
3. Preferences can be set for content types
4. Easy unsubscribe functionality

## 🛠 API Endpoints

- `POST /api/webhook/postmark` - Postmark webhook handler
- `POST /api/generate` - Generate art from voice/text input
- `POST /api/subscribe` - Subscribe to art delivery
- `POST /api/unsubscribe` - Unsubscribe from art delivery
- `GET /api/health` - System health check
- `POST /api/admin/approve` - Approve art pieces (admin)
- `POST /api/admin/delete` - Delete art pieces (admin)

## 🎨 Customization

### AI Prompts
Edit the prompts in `lib/ai.ts` to customize the style of generated content.

### Email Templates
Modify the email templates in `lib/postmark.ts` to match your branding.

### UI Styling
The app uses Tailwind CSS and shadcn/ui components for easy customization.

## 🐛 Troubleshooting

1. **Health Check Failing**: Visit `/admin` to see which services need attention
2. **Email Not Working**: Check Postmark webhook configuration and server token
3. **Images Not Generating**: Verify Fal AI API key and Vercel Blob token
4. **Database Issues**: Check Supabase connection and table creation

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.
\`\`\`

Finally, let's create a simple deployment script:
#   I n b o x - a r t  
 