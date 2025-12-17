"use client";

import { Button } from "@/components/ui/button";
import { Download, Copy, Check, AlertCircle } from "lucide-react";
import { useState } from "react";
import styles from "./styles/output-panel.module.scss";

interface OutputPanelProps {
  output: string;
  error: string | null;
  format: "json" | "csv";
  isRunning: boolean;
}

export function OutputPanel({ output, error, format, isRunning }: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

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
          <pre className={styles.output}>
            <code>{formatOutput(output, format)}</code>
          </pre>
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
