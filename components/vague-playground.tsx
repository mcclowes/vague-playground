"use client"

import { useState } from "react"
import { CodeEditor } from "./code-editor"
import { OutputPanel } from "./output-panel"
import { Toolbar } from "./toolbar"
import { FileImport } from "./file-import"

const DEFAULT_CODE = `schema Customer {
  name: string,
  status: 0.8: "active" | 0.2: "inactive"
}

schema Invoice {
  customer: any of customers,
  amount: decimal in 100..10000,
  status: "draft" | "sent" | "paid",
  assume amount > 0
}

dataset TestData {
  customers: 50 of Customer,
  invoices: 200 of Invoice
}`

export function VaguePlayground() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [output, setOutput] = useState<string>("")
  const [outputFormat, setOutputFormat] = useState<"json" | "csv">("json")
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRun = async () => {
    setIsRunning(true)
    setError(null)

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, format: outputFormat }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Execution failed")
      }

      setOutput(data.output)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <svg
              className="h-6 w-6 text-primary-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
              <circle cx="7" cy="7" r="1" fill="currentColor" />
              <circle cx="7" cy="12" r="1" fill="currentColor" />
              <circle cx="7" cy="17" r="1" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-card-foreground">Vague Playground</h1>
            <p className="text-sm text-muted-foreground">Constraint-based data generation</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/mcclowes/vague"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-card-foreground"
          >
            Documentation
          </a>
          <FileImport onImport={setCode} />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-1/2 flex-col border-r border-border">
          <Toolbar
            onRun={handleRun}
            isRunning={isRunning}
            outputFormat={outputFormat}
            onFormatChange={setOutputFormat}
          />
          <CodeEditor code={code} onChange={setCode} />
        </div>

        <div className="flex w-1/2 flex-col">
          <OutputPanel output={output} error={error} format={outputFormat} isRunning={isRunning} />
        </div>
      </div>
    </div>
  )
}
