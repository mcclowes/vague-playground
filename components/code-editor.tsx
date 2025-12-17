"use client";

import { useEffect, useRef, useCallback } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { StreamLanguage } from "@codemirror/language";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
}

const vagueLanguage = StreamLanguage.define({
  token(stream) {
    // Skip whitespace
    if (stream.eatSpace()) return null;

    // Comments
    if (stream.match("//")) {
      stream.skipToEnd();
      return "comment";
    }

    // Strings
    if (stream.match(/"[^"]*"/)) {
      return "string";
    }

    // Numbers (including ranges like 0.8: and 100..10000)
    if (stream.match(/\d+\.?\d*/)) {
      return "number";
    }

    // Keywords
    if (
      stream.match(
        /\b(schema|dataset|assume|then|when|if|any|of|where|violating|unique|private|extends|faker|issuer|using|compute)\b/
      )
    ) {
      return "keyword";
    }

    // Types
    if (stream.match(/\b(string|int|decimal|date|datetime|boolean)\b/)) {
      return "typeName";
    }

    // Operators
    if (stream.match(/\b(in|and|or|not|sum|count|min|max|avg)\b/)) {
      return "operator";
    }

    // Identifiers
    if (stream.match(/[a-zA-Z_][a-zA-Z0-9_]*/)) {
      return "variableName";
    }

    // Punctuation
    if (stream.match(/[{}(),:|.]/)) {
      return "punctuation";
    }

    // Skip unknown characters
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
});

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
    // Only initialize once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update editor content when code prop changes externally
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
    <div className="relative flex-1 overflow-hidden bg-card">
      <div ref={editorRef} className="h-full" />
    </div>
  );
}
