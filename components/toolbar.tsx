"use client"

import { Button } from "@/components/ui/button"
import { Play, FileJson, FileText } from "lucide-react"

interface ToolbarProps {
  onRun: () => void
  isRunning: boolean
  outputFormat: "json" | "csv"
  onFormatChange: (format: "json" | "csv") => void
}

export function Toolbar({ onRun, isRunning, outputFormat, onFormatChange }: ToolbarProps) {
  return (
    <div className="flex items-center gap-3 border-b border-border bg-secondary px-6 py-3">
      <Button onClick={onRun} disabled={isRunning} className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Play className="mr-2 h-4 w-4" />
        {isRunning ? "Running..." : "Run Code"}
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Output format:</span>
        <Button
          variant={outputFormat === "json" ? "default" : "outline"}
          size="sm"
          onClick={() => onFormatChange("json")}
          className={
            outputFormat === "json" ? "bg-primary text-primary-foreground" : "border-border text-card-foreground"
          }
        >
          <FileJson className="mr-1 h-4 w-4" />
          JSON
        </Button>
        <Button
          variant={outputFormat === "csv" ? "default" : "outline"}
          size="sm"
          onClick={() => onFormatChange("csv")}
          className={
            outputFormat === "csv" ? "bg-primary text-primary-foreground" : "border-border text-card-foreground"
          }
        >
          <FileText className="mr-1 h-4 w-4" />
          CSV
        </Button>
      </div>
    </div>
  )
}
