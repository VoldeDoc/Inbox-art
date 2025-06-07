"use client";

import type { ArtPiece as ArtPieceType } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Heart, Download } from "lucide-react";
import Image from "next/image";

interface ArtPieceProps {
  piece: ArtPieceType;
}

export function ArtPiece({ piece }: ArtPieceProps) {
  const formattedDate = new Date(piece.created_at).toLocaleDateString();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${piece.type} from Inbox-as-Art`,
          text: piece.content,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(
        `${piece.content}\n\nFrom Inbox-as-Art: ${window.location.href}`
      );
    }
  };

  const handleDownload = async () => {
    if (piece.type === "image" && piece.image_url) {
      const link = document.createElement("a");
      const blob = await fetch(piece.image_url).then((res) => res.blob());
      link.href = URL.createObjectURL(blob);
      link.download = `inbox-art-${piece.id}.png`;
      link.click();
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group">
      {piece.type === "image" && piece.image_url && (
        <div className="relative w-full h-64">
          <Image
            src={piece.image_url || "/placeholder.svg"}
            alt={piece.content}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <CardContent
        className={`p-4 ${piece.type === "poem" ? "font-serif" : ""}`}
      >
        {piece.type === "poem" ? (
          <div className="whitespace-pre-line text-lg leading-relaxed">
            {piece.content}
          </div>
        ) : piece.type === "story" ? (
          <p className="text-sm leading-relaxed">{piece.content}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            {piece.content}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0 text-sm text-muted-foreground">
        <div>
          <span className="font-medium">
            {piece.anonymous ? "Anonymous" : piece.source_email.split("@")[0]}
          </span>
          <span className="mx-1">•</span>
          <span>{formattedDate}</span>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          {piece.type === "image" && piece.image_url && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
