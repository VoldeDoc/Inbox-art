"use client"

import { useState, useEffect } from "react"
import { ArtPiece } from "@/components/art-piece"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { ArtPiece as ArtPieceType, ContentType } from "@/types"
import { Search, RefreshCw } from "lucide-react"

interface ArtWallProps {
  initialArtPieces: ArtPieceType[]
}

export function ArtWall({ initialArtPieces }: ArtWallProps) {
  const [artPieces, setArtPieces] = useState<ArtPieceType[]>(initialArtPieces)
  const [filteredPieces, setFilteredPieces] = useState<ArtPieceType[]>(initialArtPieces)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<ContentType | "all">("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Filter art pieces based on search query and type filter
  useEffect(() => {
    let filtered = artPieces

    if (activeFilter !== "all") {
      filtered = filtered.filter((piece) => piece.type === activeFilter)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (piece) =>
          piece.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          piece.source_email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredPieces(filtered)
  }, [artPieces, searchQuery, activeFilter])

  // Refresh content from the server
  const refreshContent = async () => {
    setIsRefreshing(true)

    try {
      const response = await fetch("/api/art-pieces")
      if (response.ok) {
        const newArtPieces = await response.json()
        setArtPieces(newArtPieces)
      }
    } catch (error) {
      console.error("Error refreshing content:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search art pieces..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
            className="flex-1 sm:flex-none"
          >
            All
          </Button>
          <Button
            variant={activeFilter === "poem" ? "default" : "outline"}
            onClick={() => setActiveFilter("poem")}
            className="flex-1 sm:flex-none"
          >
            Poems
          </Button>
          <Button
            variant={activeFilter === "story" ? "default" : "outline"}
            onClick={() => setActiveFilter("story")}
            className="flex-1 sm:flex-none"
          >
            Stories
          </Button>
          <Button
            variant={activeFilter === "image" ? "default" : "outline"}
            onClick={() => setActiveFilter("image")}
            className="flex-1 sm:flex-none"
          >
            Images
          </Button>
        </div>
        <Button variant="outline" size="icon" onClick={refreshContent} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPieces.length > 0 ? (
          filteredPieces.map((piece) => <ArtPiece key={piece.id} piece={piece} />)
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No art pieces found matching your criteria.
          </div>
        )}
      </div>
    </div>
  )
}
