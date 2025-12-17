# Vague Playground

A web-based playground for testing and experimenting with [Vague](https://github.com/mcclowes/vague), a constraint-based data generation language.

## Features

- Interactive code editor for Vague schemas
- Real-time execution with JSON/CSV output
- File import support
- Dark/light theme

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command          | Description               |
| ---------------- | ------------------------- |
| `npm run dev`    | Start development server  |
| `npm run build`  | Create production build   |
| `npm run start`  | Start production server   |
| `npm run lint`   | Run ESLint                |
| `npm run format` | Format code with Prettier |

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
- [v0 Chat](https://v0.app/chat/vHV2AkTffAe)
