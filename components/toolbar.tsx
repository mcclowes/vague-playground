"use client";

import { Button } from "@/components/ui/button";
import { Play, FileJson, FileText, Save } from "lucide-react";
import styles from "./styles/toolbar.module.scss";

interface ToolbarProps {
  onRun: () => void;
  isRunning: boolean;
  outputFormat: "json" | "csv";
  onFormatChange: (format: "json" | "csv") => void;
  code: string;
}

export function Toolbar({ onRun, isRunning, outputFormat, onFormatChange, code }: ToolbarProps) {
  const handleSaveSchema = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schema.vague";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <Button
          onClick={onRun}
          disabled={isRunning}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Play className="mr-2 h-4 w-4" />
          {isRunning ? "Running..." : "Run Code"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSaveSchema}
          className="border-border text-card-foreground bg-transparent"
        >
          <Save className="mr-1 h-4 w-4" />
          Save
        </Button>
        <span className={styles.shortcutHint}>
          <kbd className={styles.kbd}>⌘</kbd>
          <kbd className={styles.kbd}>Enter</kbd>
        </span>
      </div>

      <div className={styles.formatSelector}>
        <span className={styles.formatLabel}>Output:</span>
        <div className={styles.formatButtons}>
          <button
            className={`${styles.formatButton} ${outputFormat === "json" ? styles.active : ""}`}
            onClick={() => onFormatChange("json")}
          >
            <FileJson className="mr-1 h-3 w-3 inline" />
            JSON
          </button>
          <button
            className={`${styles.formatButton} ${outputFormat === "csv" ? styles.active : ""}`}
            onClick={() => onFormatChange("csv")}
          >
            <FileText className="mr-1 h-3 w-3 inline" />
            CSV
          </button>
        </div>
      </div>
    </div>
  );
}
