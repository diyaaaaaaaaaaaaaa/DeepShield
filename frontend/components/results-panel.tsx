"use client"

import { useEffect, useState } from "react"

interface ResultsPanelProps {
  status: "real" | "ai-generated"
  confidence: number
}

export default function ResultsPanel({ status, confidence }: ResultsPanelProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const isAI = status === "ai-generated"

  return (
    <div
      className={`max-w-2xl mx-auto glass-card p-8 mt-8 transition-all duration-500 ${
        isVisible ? "animate-in fade-in" : "opacity-0"
      } ${isAI ? "glow-blue" : "glow-neon"}`}
    >
      <div className="text-center">
        <div className="mb-6">
          <div
            className={`inline-block p-4 rounded-full ${
              isAI ? "bg-secondary/20 border border-secondary/30" : "bg-primary/20 border border-primary/30"
            }`}
          >
            {isAI ? (
              <svg className="w-8 h-8 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            )}
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-2 text-foreground">
          Result: <span className={isAI ? "text-secondary" : "text-primary"}>{isAI ? "AI-Generated" : "Real"}</span>
        </h2>

        <div className="my-8 p-6 glass-card rounded-lg border border-border/50">
          <p className="text-sm text-muted-foreground mb-2">Confidence Score</p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full h-2 bg-input rounded-full overflow-hidden border border-border/30">
                <div
                  className={`h-full transition-all duration-500 ${
                    isAI
                      ? "bg-gradient-to-r from-secondary to-secondary/50"
                      : "bg-gradient-to-r from-primary to-primary/50"
                  }`}
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>
            <span className={`text-2xl font-bold ${isAI ? "text-secondary" : "text-primary"}`}>{confidence}%</span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          {isAI
            ? "This image shows characteristics consistent with AI-generated content based on our analysis."
            : "This image appears to be authentic with no significant AI generation markers detected."}
        </p>
      </div>
    </div>
  )
}
