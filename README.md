# Vague Playground

A web-based playground for testing and experimenting with [Vague](https://github.com/mcclowes/vague), a constraint-based data generation language.

## Features

- Interactive code editor with syntax highlighting
- Real-time syntax validation with inline errors
- JSON/CSV output formats
- File import with automatic schema inference
- Code persistence (localStorage)
- Keyboard shortcuts (⌘/Ctrl+Enter to run)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command            | Description               |
| ------------------ | ------------------------- |
| `npm run dev`      | Start development server  |
| `npm run build`    | Create production build   |
| `npm run start`    | Start production server   |
| `npm run lint`     | Run ESLint                |
| `npm run format`   | Format code with Prettier |
| `npm run test`     | Run tests (watch mode)    |
| `npm run test:run` | Run tests once            |

## Example Vague Code

```vague
schema Customer {
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
}
```

## Deployment

Deployed on Vercel: [vercel.com/mcclowes/v0-vague-code-playground](https://vercel.com/mcclowes/v0-vague-code-playground)

## Links

- [Vague Language Repository](https://github.com/mcclowes/vague)
- [vague-lang on npm](https://www.npmjs.com/package/vague-lang)
