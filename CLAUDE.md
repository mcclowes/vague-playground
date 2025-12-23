# Vague Playground

Web-based playground for testing and experimenting with the [Vague](https://github.com/mcclowes/vague) constraint-based data generation language.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4 + SCSS Modules
- CodeMirror 6 (editor with custom Vague syntax highlighting)
- Radix UI (Dialog, Slot)
- vague-lang (Vague compiler and schema inference)
- Vitest (testing)

## Project Structure

```
app/
├── api/
│   ├── execute/route.ts  # Compiles Vague code via vague-lang
│   ├── infer/route.ts    # Infers schema from JSON/CSV data
│   └── validate/route.ts # Real-time syntax validation
├── layout.tsx
└── page.tsx
components/
├── ui/                   # Radix-based UI components (button, dialog)
├── styles/               # SCSS modules for component styling
│   ├── vague-playground.module.scss
│   ├── code-editor.module.scss
│   ├── output-panel.module.scss
│   ├── toolbar.module.scss
│   ├── example-selector.module.scss
│   └── theme-toggle.module.scss
├── vague-playground.tsx  # Main container (state, localStorage, shortcuts)
├── code-editor.tsx       # CodeMirror editor with Vague language mode + linting
├── output-panel.tsx      # Results display with copy/download
├── toolbar.tsx           # Run button, format selector, shortcut hint
├── file-import.tsx       # File upload dialog
├── example-selector.tsx  # Dropdown to load example Vague schemas
├── theme-toggle.tsx      # Light/dark mode toggle
└── theme-provider.tsx    # next-themes wrapper
lib/
├── utils.ts              # cn() helper for classnames
└── examples.ts           # Example Vague schemas for the selector
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
- **Inline validation** - Real-time syntax error highlighting via /api/validate
- **Schema inference** - Import JSON/CSV files to auto-generate Vague schemas
- **localStorage persistence** - Code persists across page refreshes
- **Keyboard shortcuts** - Cmd/Ctrl+Enter to run code
- **Syntax highlighting** - Custom CodeMirror language mode for Vague
- **Example schemas** - Preloaded examples to demonstrate Vague syntax
- **Dark/light mode** - Theme toggle with system preference support
- **Generation warnings** - Displays non-fatal warnings (constraint retries, unique value exhaustion)

## Registered Plugins

The execute API registers these vague-lang plugins:

- `fakerPlugin` / `fakerShorthandPlugin` - Realistic fake data (names, emails, addresses)
- `issuerPlugin` - Sequential ID generation
- `datePlugin` / `datesPlugin` - Date/time generation and manipulation
- `regexPlugin` - Regex pattern matching

## Code Style

- TypeScript strict mode
- Prettier for formatting
- ESLint with Next.js config
- SCSS modules for component styles
- Named exports for components
- Path aliases (`@/` for root imports)

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every PR:

1. Lint
2. Format check
3. Tests
4. Build

Node version pinned via `.nvmrc` (Node 22).
