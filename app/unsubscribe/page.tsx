"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { Home, Palette, Loader2 } from "lucide-react"

export default function UnsubscribePage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUnsubscribed, setIsUnsubscribed] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to unsubscribe")
      }

      setIsUnsubscribed(true)
      toast({
        title: "Unsubscribed",
        description: "You have been successfully unsubscribed from art delivery.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to unsubscribe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Unsubscribe</CardTitle>
            <CardDescription>
              {isUnsubscribed
                ? "You have been successfully unsubscribed."
                : "We're sorry to see you go. Enter your email to unsubscribe from art delivery."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isUnsubscribed ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Unsubscribing...
                    </>
                  ) : (
                    "Unsubscribe"
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">You will no longer receive art pieces in your inbox.</p>
                <Link href="/">
                  <Button className="w-full">Return to Homepage</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
