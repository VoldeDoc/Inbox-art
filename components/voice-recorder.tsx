"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, Square, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { ContentType } from "@/types"

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

interface VoiceRecorderProps {
  onSubmit?: (text: string, type: ContentType) => Promise<void>
}

export function VoiceRecorder({ onSubmit }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedType, setSelectedType] = useState<ContentType>("poem")
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = ""
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript
            } else {
              interimTranscript += event.results[i][0].transcript
            }
          }

          setTranscript(finalTranscript || interimTranscript)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error)
          setIsRecording(false)
          toast({
            title: "Speech Recognition Error",
            description: "Please try again or type your message.",
            variant: "destructive",
          })
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [toast])

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
    } else {
      setTranscript("")
      recognitionRef.current?.start()
      setIsRecording(true)
    }
  }

  const handleSubmit = async () => {
    if (!transcript.trim()) return

    setIsProcessing(true)
    try {
      if (onSubmit) {
        await onSubmit(transcript, selectedType)
        setGeneratedContent(null) // Reset when using external handler
      } else {
        // Call our API to generate content
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: transcript,
            type: selectedType,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate content")
        }

        const result = await response.json()
        
        // Store the generated content based on the actual response structure
        setGeneratedContent(
          result.generatedContent || 
          (result.artPiece?.content) || 
          (result.artPiece?.image_url) || 
          JSON.stringify(result)
        )

        toast({
          title: "Art Created!",
          description: `Your ${selectedType} has been generated and added to the art wall.`,
        })

        // Clear the transcript
        setTranscript("")
      }
    } catch (error) {
      console.error("Error submitting voice input:", error)
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="content-type" className="text-sm font-medium">
          Transform your voice into:
        </label>
        <div className="flex space-x-2">
          <Button
            variant={selectedType === "poem" ? "default" : "outline"}
            onClick={() => setSelectedType("poem")}
            className="flex-1"
          >
            Poem
          </Button>
          <Button
            variant={selectedType === "story" ? "default" : "outline"}
            onClick={() => setSelectedType("story")}
            className="flex-1"
          >
            Story
          </Button>
          <Button
            variant={selectedType === "image" ? "default" : "outline"}
            onClick={() => setSelectedType("image")}
            className="flex-1"
          >
            Image
          </Button>
        </div>
      </div>

      <div className="relative">
        <Textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Speak or type your message here..."
          className="min-h-[120px] pr-12"
        />
        <div className="absolute bottom-2 right-2">
          <Button
            size="icon"
            variant={isRecording ? "destructive" : "secondary"}
            onClick={toggleRecording}
            disabled={isProcessing}
            className="rounded-full"
          >
            {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={!transcript.trim() || isProcessing} className="w-full">
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Art...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Transform to Art
          </>
        )}
      </Button>

      {/* Display the generated content */}
      {generatedContent && (
        <div className="mt-6 p-4 border rounded-md bg-muted/50">
          <h3 className="font-medium mb-2">Generated {selectedType}:</h3>
          {selectedType === "image" ? (
            <img 
              src={generatedContent} 
              alt="Generated artwork" 
              className="w-full rounded-md"
            />
          ) : (
            <div className="whitespace-pre-wrap">{generatedContent}</div>
          )}
        </div>
      )}
    </div>
  )
}