import { ArtWall } from "@/components/art-wall"
import { ThemeToggle } from "@/components/theme-toggle"
import { getApprovedArtPieces } from "@/lib/database"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Palette, Home, Plus } from "lucide-react"

export default async function WallPage() {
  const artPieces = await getApprovedArtPieces()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-6 w-6" />
            <h1 className="text-xl font-bold">Inbox-as-Art</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="gap-1">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/#voice-section">
              <Button variant="outline" className="gap-1">
                <Plus className="h-4 w-4" />
                Create Art
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Art Wall
          </h1>
          <p className="max-w-[700px] text-muted-foreground">
            Browse a collection of AI-generated poems, stories, and images created from emails and voice messages.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{artPieces.length} pieces</span>
            <span>•</span>
            <span>Updated in real-time</span>
          </div>
        </div>

        <ArtWall initialArtPieces={artPieces} />
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Inbox-as-Art. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
