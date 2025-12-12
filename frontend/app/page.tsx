"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import UploadBox from "@/components/upload-box"
import TextDetector from "@/components/text-detector"
import ResultsPanel from "@/components/results-panel"
import HowItWorks from "@/components/how-it-works"
import AboutProject from "@/components/about-project"
import Footer from "@/components/footer"

const API_BASE_URL = "http://localhost:8000"

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<{
    status: "real" | "ai-generated"
    confidence: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<"image" | "text">("image")

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string)
      setUploadedFile(file)
      setResult(null)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyzeImage = async () => {
    if (!uploadedFile) {
      setError("Please upload an image first")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", uploadedFile)

      const response = await fetch(`${API_BASE_URL}/analyze/image`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to analyze image")
      }

      const data = await response.json()
      setResult({
        status: data.status,
        confidence: data.confidence,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze image. Please check if the backend is running.")
      console.error("Image analysis error:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAnalyzeText = async (text: string) => {
    if (text.length < 50) {
      setError("Text must be at least 50 characters long")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/analyze/text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to analyze text")
      }

      const data = await response.json()
      setResult({
        status: data.status,
        confidence: data.confidence,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze text. Please check if the backend is running.")
      console.error("Text analysis error:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <HeroSection />

        <div className="flex justify-center gap-4 my-12">
          <Button
            onClick={() => {
              setActiveTab("image")
              setResult(null)
              setUploadedImage(null)
              setUploadedFile(null)
              setError(null)
            }}
            variant={activeTab === "image" ? "default" : "outline"}
            className={activeTab === "image" ? "bg-primary text-primary-foreground glow-neon" : ""}
          >
            Image Detector
          </Button>
          <Button
            onClick={() => {
              setActiveTab("text")
              setResult(null)
              setError(null)
            }}
            variant={activeTab === "text" ? "default" : "outline"}
            className={activeTab === "text" ? "bg-secondary text-secondary-foreground glow-blue" : ""}
          >
            Text Detector
          </Button>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-center">
            {error}
          </div>
        )}

        {activeTab === "image" && (
          <>
            <div className="my-12">
              <UploadBox onImageUpload={handleImageUpload} uploadedImage={uploadedImage} />
            </div>

            {uploadedImage && (
              <div className="flex justify-center my-8">
                <Button
                  onClick={handleAnalyzeImage}
                  disabled={isAnalyzing}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 glow-neon"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Image"}
                </Button>
              </div>
            )}
          </>
        )}

        {activeTab === "text" && (
          <div className="my-12">
            <TextDetector onTextAnalyze={handleAnalyzeText} isAnalyzing={isAnalyzing} />
          </div>
        )}

        {result && <ResultsPanel status={result.status} confidence={result.confidence} />}
      </div>

      <HowItWorks />
      <AboutProject />
      <Footer />
    </main>
  )
}