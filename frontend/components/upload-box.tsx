"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"

interface UploadBoxProps {
  onImageUpload: (file: File) => void
  uploadedImage: string | null
}

export default function UploadBox({ onImageUpload, uploadedImage }: UploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith("image/")) {
        onImageUpload(file)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageUpload(e.target.files[0])
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`glass-card p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-primary/60 bg-primary/10 glow-neon"
            : "border-border/30 hover:border-primary/40 hover:bg-card/60"
        } ${uploadedImage ? "hidden" : ""}`}
      >
        <div className="mb-6">
          <div className="inline-block p-4 rounded-lg bg-primary/10 border border-primary/30 mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2 text-foreground">Drag and drop your image</h3>
        <p className="text-muted-foreground mb-6">or click to browse from your computer</p>

        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          Select Image
        </Button>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

        <p className="text-xs text-muted-foreground mt-4">Supported formats: JPG, PNG, GIF, WebP</p>
      </div>

      {uploadedImage && (
        <div className="glass-card p-8 animate-in fade-in duration-300">
          <div className="relative rounded-lg overflow-hidden border border-primary/30 mb-6">
            <img
              src={uploadedImage || "/placeholder.svg"}
              alt="Uploaded"
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>

          <Button
            onClick={() => {
              // Reset upload
              window.location.reload()
            }}
            variant="outline"
            className="w-full"
          >
            Upload Different Image
          </Button>
        </div>
      )}
    </div>
  )
}
