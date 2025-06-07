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

-- Create policies for insert (you may want to restrict this in production)
CREATE POLICY "Anyone can insert art pieces" ON art_pieces
    FOR INSERT WITH CHECK (true);

-- Create policies for subscribers (you may want to restrict this)
CREATE POLICY "Anyone can subscribe" ON subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own subscription" ON subscribers
    FOR UPDATE USING (true);
