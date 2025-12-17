# Vague Playground

Web-based playground for testing and experimenting with the [Vague](https://github.com/mcclowes/vague) constraint-based data generation language.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components (Radix UI primitives)

## Project Structure

```
app/
├── api/
│   ├── execute/route.ts  # Executes Vague code
│   └── infer/route.ts    # Schema inference endpoint
├── layout.tsx
└── page.tsx
components/
├── ui/                   # shadcn/ui components
├── vague-playground.tsx  # Main playground component
├── code-editor.tsx       # Editor panel
├── output-panel.tsx      # Results display
├── toolbar.tsx           # Run/format controls
└── file-import.tsx       # File upload
lib/
└── utils.ts              # Utility functions (cn helper)
```

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
npm run format   # Format with Prettier
```

## Code Style

- TypeScript strict mode
- Prettier for formatting
- ESLint with Next.js config
- Prefer named exports for components
- Use path aliases (`@/` for root imports)
