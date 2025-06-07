import { VoiceRecorder } from "@/components/voice-recorder"
import { SubscriptionForm } from "@/components/subscription-form"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { ArrowRight, Mail, Palette, Mic, Sparkles, Users, Zap, SendIcon } from "lucide-react"
import AuthForms from "@/components/AuthForms"
import AuthGuard from "@/components/AuthGuard"

export default function Home() {
  return (
    <AuthGuard>
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-6 w-6" />
            <h1 className="text-xl font-bold">Inbox-as-Art</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/wall">
              <Button variant="ghost">Art Wall</Button>
            </Link>
            <Link href="/unsubscribe">
              <Button variant="ghost">Unsubscribe</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-pink-950/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <div className="inline-block p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full mb-4">
                <Sparkles className="h-10 w-10" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Transform Your Art into Inbox Masterpieces
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Turn your everyday communication into beautiful poems, stories, and images using the power of AI.
                Subscribe to receive art directly in your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 min-[400px]:gap-2">
                <Link href="/wall">
                  <Button size="lg" className="gap-2">
                    View Art Wall
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="#voice-section">
                  <Button variant="outline" size="lg" className="gap-2">
                    Try Voice Input
                    <Mic className="h-4 w-4" />
                  </Button>
                </a>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 min-[400px]:gap-2">
                <a href="#subscribe-section">
                  <Button variant="outline" size="lg" className="gap-2 bg-green-600">
                    Subscribe to receive Art
                    <SendIcon className="h-4 w-4" />
                  </Button>
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="inline-block p-3 bg-blue-100 text-blue-600 rounded-full dark:bg-blue-900 dark:text-blue-300">
                  <Mail className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Email Integration</h3>
                <p className="text-muted-foreground">
                Create art on our service and watch as it transforms into a beautiful piece of art automatically.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="inline-block p-3 bg-green-100 text-green-600 rounded-full dark:bg-green-900 dark:text-green-300">
                  <Mic className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Voice Activation</h3>
                <p className="text-muted-foreground">
                  Speak your message and have it transformed into poetry, stories, or images instantly.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="inline-block p-3 bg-purple-100 text-purple-600 rounded-full dark:bg-purple-900 dark:text-purple-300">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Art Delivery</h3>
                <p className="text-muted-foreground">
                  Subscribe to receive beautiful AI-generated art pieces directly in your inbox.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Voice Input Section */}
        <section id="voice-section" className="py-12 md:py-24 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-8">
              <div className="inline-block p-2 bg-primary/10 text-primary rounded-full">
                <Zap className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter">Try Voice Input</h2>
              <p className="max-w-[700px] text-muted-foreground">
                Speak your message and watch as it transforms into art instantly.
              </p>
            </div>

            <div className="mx-auto max-w-md">
              <VoiceRecorder />
            </div>
          </div>
        </section>

        {/* Subscription Section */}
        <section className="py-12 md:py-24" id="subscribe-section">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-8">
              <h2 className="text-3xl font-bold tracking-tighter">Subscribe to Art Delivery</h2>
              <p className="max-w-[700px] text-muted-foreground">
                Get beautiful AI-generated poems, stories, and images delivered directly to your inbox.
              </p>
            </div>

            <SubscriptionForm />
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 md:py-24 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">How It Works</h2>
              <p className="max-w-[700px] text-muted-foreground">From email to art in three simple steps</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold">Send or Speak</h3>
                <p className="text-muted-foreground">
                  Send an email to our service or use voice input to share your message.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold">AI Transforms</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your content and creates beautiful poems, stories, or images.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold">Art Delivered</h3>
                <p className="text-muted-foreground">
                  View your art on our wall and receive it in your inbox if subscribed.
                </p>
              </div>
            </div>
          </div>
        </section>

      
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
            <Link href="/unsubscribe" className="text-sm text-muted-foreground hover:underline">
              Unsubscribe
            </Link>
          </div>
        </div>
      </footer>
    </div>
    </AuthGuard>
  )
}
