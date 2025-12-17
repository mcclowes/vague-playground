"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { CodeEditor } from "./code-editor";
import { OutputPanel } from "./output-panel";
import { Toolbar } from "./toolbar";
import { FileImport } from "./file-import";
import { ExampleSelector } from "./example-selector";
import { ThemeToggle } from "./theme-toggle";
import styles from "./styles/vague-playground.module.scss";

const STORAGE_KEY = "vague-playground-code";

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
}`;

function getInitialCode(): string {
  if (typeof window === "undefined") return DEFAULT_CODE;
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_CODE;
}

export function VaguePlayground() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<string>("");
  const [outputFormat, setOutputFormat] = useState<"json" | "csv">("json");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    setCode(getInitialCode());
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, code);
  }, [code]);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setError(null);

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, format: outputFormat }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Execution failed");
      }

      setOutput(data.output);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsRunning(false);
    }
  }, [code, outputFormat]);

  // Keyboard shortcut: Cmd/Ctrl+Enter to run
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (!isRunning) {
          handleRun();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRun, isRunning]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <Image
            src="/logo.png"
            alt="Vague Playground"
            width={40}
            height={40}
            className={styles.logoImage}
          />
          <div>
            <h1 className={styles.title}>Vague Playground</h1>
            <p className={styles.subtitle}>Constraint-based data generation</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <ExampleSelector onSelect={setCode} />
          <a
            href="https://github.com/mcclowes/vague"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.docsLink}
          >
            Documentation
          </a>
          <FileImport onImport={setCode} />
          <ThemeToggle />
        </div>
      </header>

      <div className={styles.main}>
        <div className={styles.editorPanel}>
          <Toolbar
            onRun={handleRun}
            isRunning={isRunning}
            outputFormat={outputFormat}
            onFormatChange={setOutputFormat}
          />
          <CodeEditor code={code} onChange={setCode} />
        </div>

        <div className={styles.outputPanel}>
          <OutputPanel output={output} error={error} format={outputFormat} isRunning={isRunning} />
        </div>
      </div>
    </div>
  );
}
