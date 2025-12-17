"use client"

import { Button } from "@/components/ui/button"
import { Download, Copy, Check, AlertCircle, Loader2 } from "lucide-react"
import { useState } from "react"

interface OutputPanelProps {
  output: string
  error: string | null
  format: "json" | "csv"
  isRunning: boolean
}

export function OutputPanel({ output, error, format, isRunning }: OutputPanelProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vague-output.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex items-center justify-between border-b border-border bg-secondary px-6 py-3">
        <h2 className="text-sm font-semibold text-card-foreground">Output</h2>
        {output && !error && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="border-border text-card-foreground bg-transparent"
            >
              {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="border-border text-card-foreground bg-transparent"
            >
              <Download className="mr-1 h-4 w-4" />
              Download
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {isRunning ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">Generating data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
              <p className="mt-4 text-sm font-semibold text-destructive">Error</p>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        ) : output ? (
          <pre className="font-mono text-sm leading-relaxed text-card-foreground">
            <code>{formatOutput(output, format)}</code>
          </pre>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">Run your Vague code to see output here</p>
          </div>
        )}
      </div>
    </div>
  )
}

function formatOutput(output: string, format: "json" | "csv"): string {
  if (format === "json") {
    try {
      return JSON.stringify(JSON.parse(output), null, 2)
    } catch {
      return output
    }
  }
  return output
}
