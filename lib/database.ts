import { supabase, supabaseAdmin } from "./supabase"
import type { ArtPiece, ContentType, Subscriber } from "@/types"

export async function getAllArtPieces(): Promise<ArtPiece[]> {
  const { data, error } = await supabase.from("art_pieces").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching art pieces:", error)
    return []
  }

  return data || []
}

export async function getApprovedArtPieces(): Promise<ArtPiece[]> {
  const { data, error } = await supabase
    .from("art_pieces")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching approved art pieces:", error)
    return []
  }

  return data || []
}

export async function getArtPiecesByType(type: ContentType): Promise<ArtPiece[]> {
  const { data, error } = await supabase
    .from("art_pieces")
    .select("*")
    .eq("type", type)
    .eq("approved", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching art pieces by type:", error)
    return []
  }

  return data || []
}

export async function addArtPiece(piece: Omit<ArtPiece, "id" | "created_at">): Promise<ArtPiece | null> {
  const { data, error } = await supabase.from("art_pieces").insert([piece]).select().single()

  if (error) {
    console.error("Error adding art piece:", error)
    return null
  }

  return data
}

export async function approveArtPiece(id: string): Promise<ArtPiece | null> {
  const { data, error } = await supabase.from("art_pieces").update({ approved: true }).eq("id", id).select().single()

  if (error) {
    console.error("Error approving art piece:", error)
    return null
  }

  return data
}

export async function deleteArtPiece(id: string): Promise<boolean> {
  const { error } = await supabase.from("art_pieces").delete().eq("id", id)

  if (error) {
    console.error("Error deleting art piece:", error)
    return false
  }

  return true
}

export async function searchArtPieces(query: string): Promise<ArtPiece[]> {
  const { data, error } = await supabase
    .from("art_pieces")
    .select("*")
    .eq("approved", true)
    .or(`content.ilike.%${query}%,source_email.ilike.%${query}%`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error searching art pieces:", error)
    return []
  }

  return data || []
}

// Subscriber functions
export async function addSubscriber(subscriber: Omit<Subscriber, "id" | "subscribed_at">): Promise<Subscriber | null> {
  const { data, error } = await supabaseAdmin.from("subscribers").insert([subscriber]).select().single()

  if (error) {
    console.error("Error adding subscriber:", error)
    return null
  }

  return data
}

export async function getSubscriber(email: string): Promise<Subscriber | null> {
  const { data, error } = await supabase.from("subscribers").select("*").eq("email", email).single()

  if (error) {
    return null
  }

  return data
}

export async function getAllActiveSubscribers(): Promise<Subscriber[]> {
  const { data, error } = await supabase.from("subscribers").select("*").eq("active", true)

  if (error) {
    console.error("Error fetching subscribers:", error)
    return []
  }

  return data || []
}

export async function updateSubscriberPreferences(email: string, preferences: any): Promise<Subscriber | null> {
  const { data, error } = await supabase
    .from("subscribers")
    .update({ preferences })
    .eq("email", email)
    .select()
    .single()

  if (error) {
    console.error("Error updating subscriber preferences:", error)
    return null
  }

  return data
}

export async function unsubscribe(email: string): Promise<boolean> {
  const { error } = await supabase.from("subscribers").update({ active: false }).eq("email", email)

  if (error) {
    console.error("Error unsubscribing:", error)
    return false
  }

  return true
}


export async function logoutUser(sessionId: string) {
  try {
    // If you're using Supabase sessions
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', sessionId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Failed to logout' };
  }
}