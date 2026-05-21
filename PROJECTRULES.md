# Studio Click House — AI Coding Rules
# Place this file at: .projectrules (project root)
# Cursor AI will read this automatically every session.

---

## Project

Company: Studio Click House (SCH) — professional photo editing/retouching company
Stack: Next.js 14 App Router · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · Lenis

---

## Strict File Structure Rules

### Pages → only in `app/`
- Every route is a folder with `page.tsx` inside
- `app/layout.tsx` is the only root layout — do not create extra layouts unless nested route needs it
- Never put component code inside page files — pages only import sections

### Components → split into 4 folders, never mix them

| Folder | What goes here |
|--------|---------------|
| `components/layout/` | Navbar, Footer, SmoothScrollProvider, PageTransition |
| `components/animations/` | Framer Motion wrapper components only |
| `components/sections/` | Full-width page sections (Hero, ServicesGrid, etc.) |
| `components/common/` | Small reusable pieces (SectionHeading, ServiceCard, etc.) |
| `components/seo/` | JSON-LD structured data components only |

### Data → only in `content/`
- Never hardcode repeated text/data inside components
- Services list, FAQs, pricing, testimonials, stats → always in `content/*.ts`
- Import from content files into sections

### Utilities → only in `lib/`
- All Framer Motion animation variants → `lib/animations.ts`
- Lenis config → `lib/lenis.ts`
- SEO metadata helper → `lib/metadata.ts`
- JSON-LD schema builders → `lib/schema.ts`
- Tailwind cn() utility → `lib/utils.ts`

### Config → only in `config/`
- Site name, URL, default OG image, social links → `config/site.ts`
- Never hardcode the site URL anywhere else

### Types → only in `types/index.ts`
- All TypeScript interfaces and types go here

---

## Animation Rules

- All animation variants defined in `lib/animations.ts` — never define inline
- Framer Motion wrapper components live in `components/animations/`
- Use these wrappers in sections, never write `motion.div` directly in section files
- Lenis smooth scroll initialized once in `components/layout/SmoothScrollProvider.tsx`
- All animated components must have `"use client"` at top

### Standard wrappers to use:
- `<FadeUp>` — scroll fade up (default for most elements)
- `<FadeIn>` — simple opacity fade
- `<StaggerContainer>` — parent when children stagger
- `<TextReveal>` — heading word/line reveal
- `<ParallaxImage>` — image parallax on scroll
- `<MarqueeScroll>` — infinite ticker

---

## SEO Rules

- Every `page.tsx` must export `metadata` using `generatePageMetadata()` from `lib/metadata.ts`
- Default site config always from `config/site.ts` — never hardcode URLs
- `app/sitemap.ts` generates sitemap — add new pages here when created
- JSON-LD structured data added via components in `components/seo/`
- OG images stored in `public/images/og/`
- Every service page needs its own OG image and JSON-LD schema

---

## Code Style Rules

- Always use TypeScript — no `.js` files
- Always use named exports — no default exports except page.tsx files
- Use `cn()` from `lib/utils.ts` for conditional Tailwind classes
- Use `lucide-react` for all icons — no other icon libraries
- Forms use `react-hook-form` + `zod` validation
- All colors use Tailwind brand tokens from `tailwind.config.ts` — never raw hex in JSX

---

## What NOT to Do

- Do NOT put component logic inside `app/` page files
- Do NOT write animation variants inline — use `lib/animations.ts`
- Do NOT hardcode service names, FAQ text, pricing — use `content/` files
- Do NOT install new packages without checking if existing stack covers it
- Do NOT create new folders outside the defined structure
- Do NOT use `default export` in components — only in pages

---

## When Creating a New Page

1. Create `app/[page-name]/page.tsx`
2. Add metadata export using `generatePageMetadata()`
3. Import sections from `components/sections/`
4. If new section needed → create in `components/sections/`
5. If new data needed → add to relevant `content/*.ts` file
6. Add page URL to `app/sitemap.ts`
7. Add JSON-LD schema if it's a service or blog page

---

## When Creating a New Section

1. Create file in `components/sections/`
2. Data comes from `content/` — never hardcode
3. Wrap animated elements with components from `components/animations/`
4. Use `SectionHeading` from `components/common/` for h2 headings
5. Mark as `"use client"` only if it has animations or interactivity

---

## Brand

- Primary color: `#7ea641` (brand-green)
- Dark: `#1a1a1a`
- Light: `#f8f8f6`
- Font: Plus Jakarta Sans
- Company: Studio Click House | studioclickhouse.com
