"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface FileImportProps {
  onImport: (code: string) => void
}

export function FileImport({ onImport }: FileImportProps) {
  const [open, setOpen] = useState(false)
  const [isInferring, setIsInferring] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsInferring(true)

    try {
      const text = await file.text()

      const response = await fetch("/api/infer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: text,
          format: file.name.endsWith(".csv") ? "csv" : "json",
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Inference failed")
      }

      onImport(result.code)
      setOpen(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to infer schema from file")
    } finally {
      setIsInferring(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-border text-card-foreground bg-transparent">
          <Upload className="mr-2 h-4 w-4" />
          Import File
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>Import Data File</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Upload a JSON or CSV file to automatically infer Vague schema code
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <label
            htmlFor="file-upload"
            className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary transition-colors hover:bg-secondary/80"
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              {isInferring ? "Inferring schema..." : "Click to upload file"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">JSON or CSV files</p>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".json,.csv"
            onChange={handleFileUpload}
            disabled={isInferring}
            className="hidden"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
