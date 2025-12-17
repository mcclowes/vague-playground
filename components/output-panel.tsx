"use client";

import { Button } from "@/components/ui/button";
import { Download, Copy, Check, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { syntaxHighlighting, HighlightStyle, StreamLanguage } from "@codemirror/language";
import { json } from "@codemirror/lang-json";
import { tags } from "@lezer/highlight";
import styles from "./styles/output-panel.module.scss";

interface OutputPanelProps {
  output: string;
  error: string | null;
  format: "json" | "csv";
  isRunning: boolean;
}

const csvLanguage = StreamLanguage.define({
  token(stream) {
    if (stream.sol()) {
      stream.eatWhile(/[^,\n]/);
      return "variableName";
    }

    if (stream.eat(",")) {
      return "punctuation";
    }

    if (stream.match(/"[^"]*"/)) {
      return "string";
    }

    if (stream.match(/-?\d+\.?\d*/)) {
      return "number";
    }

    if (stream.match(/\b(true|false)\b/i)) {
      return "bool";
    }

    stream.eatWhile(/[^,\n]/);
    return "string";
  },
});

const outputHighlightStyle = HighlightStyle.define([
  { tag: tags.propertyName, color: "oklch(0.7 0.15 270)" },
  { tag: tags.string, color: "oklch(0.7 0.18 140)" },
  { tag: tags.number, color: "oklch(0.75 0.15 60)" },
  { tag: tags.bool, color: "oklch(0.65 0.15 340)" },
  { tag: tags.null, color: "oklch(0.5 0 0)" },
  { tag: tags.punctuation, color: "oklch(0.6 0 0)" },
  { tag: tags.variableName, color: "oklch(0.8 0.05 250)" },
]);

const outputTheme = EditorView.theme({
  "&": {
    height: "100%",
    fontSize: "14px",
    backgroundColor: "transparent",
  },
  ".cm-content": {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    padding: "0",
    caretColor: "transparent",
  },
  ".cm-line": {
    lineHeight: "1.6",
  },
  ".cm-scroller": {
    overflow: "auto",
  },
  ".cm-cursor": {
    display: "none",
  },
  "&.cm-focused .cm-cursor": {
    display: "none",
  },
  "&.cm-focused": {
    outline: "none",
  },
  ".cm-selectionBackground": {
    backgroundColor: "oklch(0.7 0.1 250 / 0.3)",
  },
  "&.cm-focused .cm-selectionBackground": {
    backgroundColor: "oklch(0.7 0.1 250 / 0.3)",
  },
});

export function OutputPanel({ output, error, format, isRunning }: OutputPanelProps) {
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vague-output.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formattedOutput = formatOutput(output, format);

  useEffect(() => {
    if (!editorRef.current || !output || error) {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
      return;
    }

    const languageExtension = format === "json" ? json() : csvLanguage;

    const state = EditorState.create({
      doc: formattedOutput,
      extensions: [
        EditorView.editable.of(false),
        languageExtension,
        syntaxHighlighting(outputHighlightStyle),
        outputTheme,
        EditorView.lineWrapping,
      ],
    });

    if (viewRef.current) {
      viewRef.current.destroy();
    }

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [formattedOutput, format, output, error]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Output</h2>
        {output && !error && (
          <div className={styles.actions}>
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

      <div className={styles.content}>
        {isRunning ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
          </div>
        ) : error ? (
          <div className={styles.placeholder}>
            <div className="text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
              <p className={`mt-4 text-sm font-semibold ${styles.error}`}>Error</p>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          </div>
        ) : output ? (
          <div ref={editorRef} className={styles.output} />
        ) : (
          <div className={styles.placeholder}>Run your Vague code to see output here</div>
        )}
      </div>
    </div>
  );
}

function formatOutput(output: string, format: "json" | "csv"): string {
  if (format === "json") {
    try {
      return JSON.stringify(JSON.parse(output), null, 2);
    } catch {
      return output;
    }
  }
  return output;
}
