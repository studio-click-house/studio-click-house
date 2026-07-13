# Studio Click House — Agent & AI Coding Rules

# Applies to: Cursor AI, Claude, Copilot, or any AI assistant working on this project.

# Stack: Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Framer Motion · Lenis

---

## Project

Company: Studio Click House (SCH) — professional photo editing/retouching company
Site: studioclickhouse.com
No backend / no NestJS — this is a pure Next.js frontend project with API route handlers only.

---

## Git Rules — STRICT, NO EXCEPTIONS

- NEVER run `git commit` without explicit user instruction. Not even "just saving progress."
- NEVER run `git push` without explicit user instruction.
- NEVER run `git add` as part of a task unless the user specifically said "stage" or "add to git."
- NEVER auto-stage, auto-commit, or auto-push after completing a coding task.
- NEVER combine a code task with a git operation in the same turn.
- If asked to "save" or "deploy" → ask the user exactly what they mean before touching git.
- Only allowed git actions: reading status (`git status`, `git log`, `git diff`) — these are safe and read-only.
- Any git write operation (`add`, `commit`, `push`, `merge`, `rebase`, `reset`) → STOP and ask the user first, every single time.

---

## Core Rules

- Change only what was asked. Small/safe → do it; wider impact → ask first.
- Question or "answer me" → text only, no code edits that turn.
- After a task: one issue note only. No auto-fixing unrelated issues.
- No refactoring or renaming outside scope.

---

## Before Writing

- Read every affected file first. Trace full data flow (callers, callees, readers/writers).
- If structure is unclear, ask. Never assume.
- Match existing style, naming, and patterns exactly. No new patterns.

---

## Files & Structure

- Do not move or rename files.
- New files: match folder, naming, casing, and pluralization exactly. Unsure → ask.
- Do NOT create new folders outside the defined structure below.

### Pages → only in `app/`

- Every route is a folder with `page.tsx` inside.
- `app/layout.tsx` is the only root layout — no extra layouts unless a nested route truly needs it.
- Never put component or section logic inside page files — pages only import sections.

### Components → split into 5 folders, never mix them

| Folder                   | What goes here                                                      |
| ------------------------ | ------------------------------------------------------------------- |
| `components/layout/`     | Navbar, Footer, SmoothScrollProvider, PageTransition                |
| `components/animations/` | Framer Motion wrapper components ONLY                               |
| `components/sections/`   | Full-width page sections (HeroSection, ServicesGrid, etc.)          |
| `components/common/`     | Small reusable pieces (SectionHeading, ServiceCard, BlogCard, etc.) |
| `components/seo/`        | JSON-LD structured data components ONLY                             |
| `components/ui/`         | shadcn/ui base components ONLY — do not put custom code here        |

### Data → only in `content/`

- Never hardcode repeated text or data inside components.
- Services, FAQs, pricing, testimonials, stats → always in `content/*.ts`.
- Import from content files into sections — never inline.

### Utilities → only in `lib/`

- All Framer Motion animation variants → `lib/animations.ts` — never define inline.
- Lenis smooth scroll config → `lib/lenis.ts`
- SEO metadata helper → `lib/metadata.ts`
- JSON-LD schema builders → `lib/schema.ts`
- Tailwind `cn()` utility → `lib/utils.ts`

### Config → only in `config/`

- Site name, URL, default OG image, social links → `config/site.ts`.
- Never hardcode the site URL anywhere else.

### Types → only in `types/index.ts`

- All TypeScript interfaces and types live here.

### Hooks → only in `hooks/`

- Custom React hooks only (e.g. `useScrollProgress.ts`, `useInView.ts`).

---

## Engineering

- No new libraries, abstractions, or patterns unless required and already aligned with the stack.
- No magic strings. Use constants from `config/site.ts` or `content/` files.
- Parallel awaits for independent async operations.
- No `console.log`, commented-out code, or TODOs in production.
- No over-engineering, hacky workarounds, unnecessary defaults, or guessing.

---

## Next.js Rules (v16 App Router · React 19)

- App Router only. Server Components by default; add `"use client"` only when truly needed.
- No DB or external API logic in components — use Server Actions or `app/api/` route handlers only.
- Use `next/image` for all images. Use `next/link` for all internal links.
- Keep business logic out of components — it belongs in `lib/` or `content/`.
- Every `page.tsx` must export a `metadata` object using `generatePageMetadata()` from `lib/metadata.ts`.
- `app/sitemap.ts` must be updated whenever a new page is added.
- All animated components that use Framer Motion must have `"use client"` at the top.

---

## Animation Rules

- All Framer Motion animation variants defined in `lib/animations.ts` — never inline.
- Framer Motion wrapper components live in `components/animations/` — use these in sections.
- Never write `motion.div` directly inside section files — always use the wrapper.
- Lenis smooth scroll initialized once only in `components/layout/SmoothScrollProvider.tsx`.

### Standard animation wrappers (use these, don't create new ones without asking):

- `<FadeUp>` — scroll fade up, default for most elements
- `<FadeIn>` — simple opacity fade
- `<StaggerContainer>` — parent wrapper when children need stagger
- `<TextReveal>` — heading word/line reveal on scroll
- `<ParallaxImage>` — image parallax on scroll
- `<MarqueeScroll>` — infinite horizontal ticker

---

## SEO Rules

- Every `page.tsx` exports `metadata` via `generatePageMetadata()` from `lib/metadata.ts`.
- Site URL and defaults always from `config/site.ts` — never hardcoded.
- JSON-LD structured data added via components in `components/seo/`.
- OG images stored in `public/images/og/`.
- Every service page needs its own OG image and JSON-LD schema.

---

## TypeScript

- Understand data shape; fix types properly.
- No `as`, `any`, `unknown`, or type predicates (`is`) to force types.
- No redundant annotations. Add explicit types only when inferred type would be unclear.
- No single-use utility types that already exist in `types/index.ts`.

---

## Naming Conventions

- Variable and parameter names must be meaningful and self-descriptive.
- No single-letter or abbreviated names that require guessing.
- Loop variables and callbacks must reflect what the item represents:
  `services.map((service) => ...)` not `services.map((s) => ...)`.
- `camelCase` for variables and functions.
- `PascalCase` for components and types.
- `UPPER_SNAKE_CASE` for constants.
- File names match component names exactly: `HeroSection.tsx` not `hero.tsx`.

---

## Code Style Rules

- Always TypeScript — no `.js` files ever.
- Named exports everywhere — no default exports except `page.tsx` files.
- Use `cn()` from `lib/utils.ts` for all conditional Tailwind classes.
- Use `lucide-react` for all icons — no other icon libraries.
- Forms use `react-hook-form` + `zod` validation always.
- All colors use Tailwind brand tokens from `tailwind.config.ts` — never raw hex in JSX.
- Minimal comments — only for genuinely complex logic.

---

## Brand Tokens (never hardcode these values directly in JSX)

| Token         | Value                     |
| ------------- | ------------------------- |
| Primary green | `brand-green` → `#7ea641` |
| Dark          | `brand-dark` → `#1a1a1a`  |
| Light         | `brand-light` → `#f8f8f6` |
| Font          | Plus Jakarta Sans         |

---

## What NOT to Do

- Do NOT put component or section logic inside `app/` page files.
- Do NOT write Framer Motion variants inline — always use `lib/animations.ts`.
- Do NOT hardcode service names, FAQ text, pricing, testimonials — use `content/` files.
- Do NOT install new packages without checking if the existing stack covers it.
- Do NOT create folders outside the defined structure.
- Do NOT use `default export` in components — only in `page.tsx` files.
- Do NOT use raw hex colors in JSX — use brand tokens only.
- Do NOT write `motion.div` directly in section files — use animation wrappers.

---

## When Creating a New Page

1. Create `app/[page-name]/page.tsx`
2. Export `metadata` using `generatePageMetadata()` from `lib/metadata.ts`
3. Import sections from `components/sections/`
4. If a new section is needed → create it in `components/sections/`
5. If new data is needed → add to relevant `content/*.ts` file
6. Update `app/sitemap.ts` with the new page URL
7. Add JSON-LD schema component if it's a service or blog page

---

## When Creating a New Section

1. Create file in `components/sections/`
2. Pull data from `content/` — never hardcode text inside the section
3. Wrap animated elements using components from `components/animations/`
4. Use `<SectionHeading>` from `components/common/` for all h2 headings
5. Add `"use client"` only if the section has animations or interactivity

---

## Code Review Format

```
Quality: [Acceptable / Good / Production-Ready]
Strengths:
Concerns:
AI-Code Risk: forced types · wrong layer · hardcoded data · inline animation · extra fetch · null path · style mismatch · client overuse · structure violation · magic string · raw color
```

---

## Working Style

- Professional engineer mindset: maintainability, architecture, correctness.
- Self-check after finishing. Verify nothing missed, result is clean.
- One issue note after task completion — do not auto-fix unrelated things.
