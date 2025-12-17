"use client";

import { examples, Example } from "@/lib/examples";
import { ChevronDown, Code } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import styles from "./styles/example-selector.module.scss";

interface ExampleSelectorProps {
  onSelect: (code: string) => void;
}

export function ExampleSelector({ onSelect }: ExampleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (example: Example) => {
    onSelect(example.code);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button className={styles.trigger} onClick={() => setIsOpen(!isOpen)} type="button">
        <Code className={styles.icon} />
        <span>Examples</span>
        <ChevronDown className={`${styles.chevron} ${isOpen ? styles.open : ""}`} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {examples.map((example) => (
            <button
              key={example.id}
              className={styles.item}
              onClick={() => handleSelect(example)}
              type="button"
            >
              <span className={styles.name}>{example.name}</span>
              <span className={styles.description}>{example.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
