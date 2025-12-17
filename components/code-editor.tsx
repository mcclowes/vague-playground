"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface CodeEditorProps {
  code: string
  onChange: (code: string) => void
}

export function CodeEditor({ code, onChange }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [code])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newValue = code.substring(0, start) + "  " + code.substring(end)
      onChange(newValue)
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
  }

  return (
    <div className="relative flex-1 overflow-auto bg-card">
      <div className="absolute inset-0 p-6">
        <pre className="pointer-events-none absolute left-6 top-6 font-mono text-sm leading-relaxed">
          <code
            className="text-card-foreground"
            dangerouslySetInnerHTML={{
              __html: highlightVagueCode(code),
            }}
          />
        </pre>
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="relative z-10 min-h-full w-full resize-none bg-transparent font-mono text-sm leading-relaxed text-transparent caret-card-foreground outline-none"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />
      </div>
    </div>
  )
}

function highlightVagueCode(code: string): string {
  const keywords = [
    "schema",
    "dataset",
    "assume",
    "then",
    "when",
    "if",
    "any",
    "of",
    "where",
    "violating",
    "unique",
    "private",
  ]
  const types = ["string", "int", "decimal", "date", "datetime"]
  const operators = ["in", "and", "or", "not"]

  let highlighted = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

  // Keywords
  keywords.forEach((keyword) => {
    highlighted = highlighted.replace(
      new RegExp(`\\b(${keyword})\\b`, "g"),
      '<span style="color: oklch(0.7 0.15 270)">$1</span>',
    )
  })

  // Types
  types.forEach((type) => {
    highlighted = highlighted.replace(
      new RegExp(`\\b(${type})\\b`, "g"),
      '<span style="color: oklch(0.6 0.15 200)">$1</span>',
    )
  })

  // Operators
  operators.forEach((op) => {
    highlighted = highlighted.replace(
      new RegExp(`\\b(${op})\\b`, "g"),
      '<span style="color: oklch(0.65 0.15 340)">$1</span>',
    )
  })

  // Strings
  highlighted = highlighted.replace(/"([^"]*)"/g, '<span style="color: oklch(0.7 0.18 140)">$&</span>')

  // Numbers
  highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span style="color: oklch(0.75 0.15 60)">$1</span>')

  // Comments
  highlighted = highlighted.replace(/\/\/(.*?)$/gm, '<span style="color: oklch(0.5 0 0)">$&</span>')

  return highlighted
}
