# Vague Playground

Web-based playground for testing and experimenting with the [Vague](https://github.com/mcclowes/vague) constraint-based data generation language.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- CodeMirror 6 (editor with custom Vague syntax highlighting)
- Radix UI (Dialog, Slot)
- vague-lang (Vague compiler and schema inference)

## Project Structure

```
app/
├── api/
│   ├── execute/route.ts  # Compiles Vague code via vague-lang
│   └── infer/route.ts    # Infers schema from JSON/CSV data
├── layout.tsx
└── page.tsx
components/
├── ui/                   # Radix-based UI components
├── vague-playground.tsx  # Main container (state, localStorage, shortcuts)
├── code-editor.tsx       # CodeMirror editor with Vague language mode
├── output-panel.tsx      # Results display with copy/download
├── toolbar.tsx           # Run button, format selector
└── file-import.tsx       # File upload dialog
lib/
└── utils.ts              # cn() helper for classnames
__tests__/
├── utils.test.ts         # Unit tests for utilities
└── vague-integration.test.ts  # Integration tests for vague-lang
```

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run format:check # Check formatting (CI)
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once (CI)
```

## Features

- **Real Vague execution** - Uses vague-lang to compile schemas and generate data
- **Schema inference** - Import JSON/CSV files to auto-generate Vague schemas
- **localStorage persistence** - Code persists across page refreshes
- **Keyboard shortcuts** - Cmd/Ctrl+Enter to run code
- **Syntax highlighting** - Custom CodeMirror language mode for Vague

## Code Style

- TypeScript strict mode
- Prettier for formatting
- ESLint with Next.js config
- Named exports for components
- Path aliases (`@/` for root imports)

## CI

GitHub Actions runs on every PR:

1. Lint
2. Format check
3. Tests
4. Build
