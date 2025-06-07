"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export function SubscriptionForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [preferences, setPreferences] = useState({
    receive_poems: true,
    receive_stories: true,
    receive_images: true,
    frequency: "daily" as "daily" | "weekly" | "monthly",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          preferences,
        }),
      });

      const data = await response.json();

      
      if (response.ok) {
        toast("Thanks for subscribing! Check your inbox for a welcome message.");
        // Reset form on success
        setEmail("");
        setName("");
      } else {
        // Handle specific error cases
        if (data.error && data.error.includes("already subscribed")) {
          toast("This email is already subscribed to our art delivery service.");
        } else {
          // Generic error
          toast(data.error || "Failed to subscribe. Please try again later.");
        }
      }
    } catch (error: any) {
      toast("Failed to subscribe. Please try again later.");
      console.error("Subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="inline-block p-2 bg-primary/10 text-primary rounded-full mb-4 mx-auto">
          <Mail className="h-6 w-6" />
        </div>
        <CardTitle>Subscribe to Art Delivery</CardTitle>
        <CardDescription>
          Receive beautiful AI-generated poems, stories, and images directly in
          your inbox
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name (Optional)</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-3">
            <Label>What would you like to receive?</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="poems"
                  checked={preferences.receive_poems}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({
                      ...prev,
                      receive_poems: !!checked,
                    }))
                  }
                />
                <Label htmlFor="poems">Poems</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stories"
                  checked={preferences.receive_stories}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({
                      ...prev,
                      receive_stories: !!checked,
                    }))
                  }
                />
                <Label htmlFor="stories">Stories</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="images"
                  checked={preferences.receive_images}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({
                      ...prev,
                      receive_images: !!checked,
                    }))
                  }
                />
                <Label htmlFor="images">Images</Label>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              "Subscribe to Art Delivery"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}