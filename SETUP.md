# Studio Click House — Project Setup

## 1. Create Next.js Project

```bash
npx create-next-app@latest sch-website --typescript --tailwind --eslint --app --src-dir no --import-alias "@/*"
cd sch-website
```

## 2. Install All Dependencies

```bash
# Animations & Scroll
npm install framer-motion lenis

# shadcn setup
npx shadcn@latest init

# shadcn components we need
npx shadcn@latest add button badge card accordion separator sheet

# Icons
npm install lucide-react

# Forms
npm install react-hook-form zod @hookform/resolvers
```

## 3. Create Folder Structure (run all at once)

```bash
mkdir -p app/about
mkdir -p app/services/\[slug\]
mkdir -p app/portfolio
mkdir -p app/pricing
mkdir -p "app/blog/[slug]"
mkdir -p app/contact
mkdir -p app/privacy
mkdir -p app/terms
mkdir -p app/api/contact
mkdir -p components/layout
mkdir -p components/seo
mkdir -p components/animations
mkdir -p components/sections
mkdir -p components/common
mkdir -p lib
mkdir -p hooks
mkdir -p content
mkdir -p types
mkdir -p config
mkdir -p public/images/portfolio
mkdir -p public/images/services
mkdir -p public/images/team
mkdir -p public/images/og
mkdir -p public/fonts
mkdir -p styles
```

## 4. Install Fonts (Google Fonts in layout.tsx)

```tsx
// app/layout.tsx — add this
import { Inter, Plus_Jakarta_Sans } from "next/font/google"

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" })
```

## 5. tailwind.config.ts — add brand colors

```ts
theme: {
  extend: {
    colors: {
      brand: {
        green: "#7ea641",         // SCH primary
        dark: "#1a1a1a",
        light: "#f8f8f6",
      }
    },
    fontFamily: {
      sans: ["var(--font-sans)"],
    }
  }
}
```

## 6. styles/globals.css — add CSS variables

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --brand-green: #7ea641;
    --brand-dark: #1a1a1a;
    --brand-light: #f8f8f6;
  }
}
```

## Done. Now open in Cursor and follow RULES.md
