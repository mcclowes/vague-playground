"use client";

import { useEffect, useRef, useCallback } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { linter, type Diagnostic } from "@codemirror/lint";
import { tags } from "@lezer/highlight";
import { StreamLanguage } from "@codemirror/language";
import styles from "./styles/code-editor.module.scss";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
}

interface ValidationError {
  line: number;
  column: number;
  message: string;
}

const vagueLanguage = StreamLanguage.define({
  token(stream) {
    if (stream.eatSpace()) return null;

    if (stream.match("//")) {
      stream.skipToEnd();
      return "comment";
    }

    if (stream.match(/"[^"]*"/)) {
      return "string";
    }

    if (stream.match(/\d+\.?\d*/)) {
      return "number";
    }

    if (
      stream.match(
        /\b(schema|dataset|assume|then|when|if|any|of|where|violating|unique|private|extends|faker|issuer|using|compute)\b/
      )
    ) {
      return "keyword";
    }

    if (stream.match(/\b(string|int|decimal|date|datetime|boolean)\b/)) {
      return "typeName";
    }

    if (stream.match(/\b(in|and|or|not|sum|count|min|max|avg)\b/)) {
      return "operator";
    }

    if (stream.match(/[a-zA-Z_][a-zA-Z0-9_]*/)) {
      return "variableName";
    }

    if (stream.match(/[{}(),:|.]/)) {
      return "punctuation";
    }

    stream.next();
    return null;
  },
});

const vagueHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "oklch(0.7 0.15 270)" },
  { tag: tags.typeName, color: "oklch(0.6 0.15 200)" },
  { tag: tags.operator, color: "oklch(0.65 0.15 340)" },
  { tag: tags.string, color: "oklch(0.7 0.18 140)" },
  { tag: tags.number, color: "oklch(0.75 0.15 60)" },
  { tag: tags.comment, color: "oklch(0.5 0 0)", fontStyle: "italic" },
  { tag: tags.variableName, color: "oklch(0.8 0.05 250)" },
  { tag: tags.punctuation, color: "oklch(0.6 0 0)" },
]);

const editorTheme = EditorView.theme({
  "&": {
    height: "100%",
    fontSize: "14px",
  },
  ".cm-content": {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    padding: "24px",
  },
  ".cm-line": {
    lineHeight: "1.6",
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    border: "none",
    paddingLeft: "16px",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    color: "oklch(0.5 0 0)",
    paddingRight: "16px",
    minWidth: "32px",
  },
  ".cm-activeLine": {
    backgroundColor: "oklch(0.5 0 0 / 0.05)",
  },
  ".cm-cursor": {
    borderLeftColor: "currentColor",
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "currentColor",
  },
  ".cm-scroller": {
    overflow: "auto",
  },
  ".cm-diagnostic-error": {
    borderLeft: "3px solid oklch(0.6 0.25 25)",
    paddingLeft: "8px",
    backgroundColor: "oklch(0.6 0.15 25 / 0.1)",
  },
  ".cm-lintRange-error": {
    backgroundImage: "none",
    textDecoration: "wavy underline oklch(0.6 0.25 25)",
    textUnderlineOffset: "3px",
  },
  ".cm-lint-marker-error": {
    content: '""',
  },
});

const vagueLinter = linter(
  async (view) => {
    const code = view.state.doc.toString();
    if (!code.trim()) return [];

    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.valid || !data.errors?.length) {
        return [];
      }

      const diagnostics: Diagnostic[] = data.errors.map((error: ValidationError) => {
        const line = view.state.doc.line(Math.min(error.line, view.state.doc.lines));
        const from = line.from + Math.min(error.column - 1, line.length);
        const to = Math.min(from + 10, line.to);

        return {
          from,
          to,
          severity: "error" as const,
          message: error.message,
        };
      });

      return diagnostics;
    } catch {
      return [];
    }
  },
  { delay: 500 }
);

export function CodeEditor({ code, onChange }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const handleChange = useCallback(
    (update: { state: EditorState; docChanged: boolean }) => {
      if (update.docChanged) {
        onChange(update.state.doc.toString());
      }
    },
    [onChange]
  );

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: code,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        vagueLanguage,
        syntaxHighlighting(vagueHighlightStyle),
        editorTheme,
        vagueLinter,
        EditorView.updateListener.of(handleChange),
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (view && view.state.doc.toString() !== code) {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: code,
        },
      });
    }
  }, [code]);

  return (
    <div className={styles.container}>
      <div ref={editorRef} className={styles.editor} />
    </div>
  );
}
