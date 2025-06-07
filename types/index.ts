export type ContentType = "poem" | "story" | "image"

export interface ArtPiece {
  id: string
  type: ContentType
  content: string
  image_url?: string | null
  source_email: string
  created_at: string
  approved: boolean
  anonymous: boolean
  metadata?: Record<string, any> | null
}

export interface Subscriber {
  id: string
  email: string
  name?: string | null
  subscribed_at: string
  active: boolean
  preferences?: {
    receive_poems?: boolean
    receive_stories?: boolean
    receive_images?: boolean
    frequency?: "daily" | "weekly" | "monthly"
  } | null
}

export interface EmailPayload {
  subject: string
  textBody: string
  htmlBody?: string
  from: string
  to: string
  messageId: string
}


type User = {
  id: string
  email: string
  password_hash: string
  created_at: string
  last_login_at: string | null
  last_login_ip: string | null
}