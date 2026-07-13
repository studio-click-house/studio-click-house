# Studio Click House — Agent & AI Coding Rules

# Applies to Cursor AI, Claude, Copilot, and any AI assistant working on this project.

# Stack: SvelteKit · Svelte 5 · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger + Lenis · shadcn-svelte · Cloudflare · Bun

---

## Project

Studio Click House (SCHL) is a marketing website for a creative studio specialising in image and video work. The website should feel like an elegant visual experience while remaining fast, accessible, SEO-friendly, and usable on low-powered mobile devices.

The application is a SvelteKit frontend deployed on private VPS.

---

## Git Rules — STRICT, NO EXCEPTIONS

- Never run `git add`, `git commit`, or `git push` unless the user explicitly requests that exact action.
- Never auto-stage, auto-commit, or auto-push after a coding task.
- Read-only Git commands (`git status`, `git log`, `git diff`) are allowed.
- If the user asks to “save” or “deploy”, ask what they mean before touching Git.

---

## Core Rules

- Change only what was asked. Keep changes small and local.
- A question or “answer me” request means text only; do not edit code in that turn.
- Read every affected file first and trace its data flow before writing.
- Match existing project naming, architecture, and style. Do not introduce patterns or dependencies without a clear need.
- After a task, report at most one unrelated issue. Do not auto-fix it.

---

## Files and Structure

Do not move or rename files without explicit permission. New files must use the structure below.

### Routes — only in `src/routes/`

- Every page route uses `+page.svelte`.
- Shared route shells use `+layout.svelte`.
- Server data and form actions belong in `+page.server.ts`.
- HTTP handlers belong in `+server.ts`.
- Route files compose sections; they do not contain large section implementations.
- Add a new route to `src/routes/sitemap.xml/+server.ts` when the page is public.

### Components — only in `src/lib/components/`

| Folder | What goes here |
| --- | --- |
| `layout/` | Navbar, footer, page shell, navigation |
| `animations/` | Small reusable GSAP-aware animation components/actions |
| `sections/` | Full-width page sections |
| `common/` | Small reusable pieces such as cards and headings |
| `seo/` | Reusable JSON-LD/schema components or builders |
| `ui/` | shadcn-svelte generated base components only |

### Data, configuration, and utilities

- Repeated services, FAQs, pricing, testimonials, and portfolio metadata belong in `src/lib/content/`.
- Site name, URL, social links, and default OG image belong in `src/lib/config/site.ts`.
- Shared utilities belong in `src/lib/utils/`; use `cn()` from `$lib/utils` for conditional Tailwind classes.
- GSAP, ScrollTrigger, and Lenis setup and shared helpers belong in `src/lib/animations/`.
- Shared TypeScript interfaces belong in `src/lib/types/`.
- Custom Svelte hooks/actions belong in `src/lib/hooks/`.
- Static fallback assets and self-hosted fonts belong in `static/`.

---

## SvelteKit Rules

- Use Svelte 5 runes only when state, derived state, or effects are genuinely needed.
- Prefer server-rendered pages. Client-side code is for browser APIs, interaction, or animation only.
- Use SvelteKit form actions and `sveltekit-superforms` for forms; validate with Zod on the server.
- Keep business logic out of `.svelte` components when it can live in `src/lib/` or a server module.
- Use normal semantic HTML for images and links. Give every meaningful image an accurate `alt`, explicit dimensions or aspect ratio, and a loading strategy.
- Do not use React concepts, React files, `"use client"`, Next.js APIs, `next/image`, or `next/link`.

---

## Animation and Performance Rules

- Use GSAP and ScrollTrigger for intentional editorial motion, not as decoration on every element.
- Use Lenis for the single site-wide smooth-scroll instance. It must be initialized once in the root layout layer, integrated with the GSAP ticker, and destroyed when that layer is destroyed.
- Register ScrollTrigger only in browser-executed code and clean up every GSAP context in `onMount` cleanup.
- Do not initialize Lenis inside sections or create competing request-animation-frame loops.
- Animate transforms and opacity whenever possible. Avoid layout-triggering properties and expensive filters on mobile.
- Respect `prefers-reduced-motion`; provide a still, fully usable experience when motion is reduced.
- Avoid pinned sections and continuous scroll effects on small screens unless they are tested and justified.
- Lazy-load below-the-fold images and video. Use responsive sources, compressed formats, poster images, and pause video when it is offscreen.
- Do not add 3D/WebGL libraries or effects unless the user explicitly asks.

---

## Cloudflare, R2, and Analytics

- Deploy through `@sveltejs/adapter-cloudflare` and Wrangler.
- Cloudflare R2 stores original portfolio media. Serve public media through the configured Cloudflare custom domain/CDN, not direct ad-hoc bucket URLs.
- Keep bucket bindings, API tokens, and credentials server-only. Never expose them in client code or commit `.dev.vars`.
- Add the R2 binding to `wrangler.jsonc` only after the real bucket name is known.
- Add Cloudflare Web Analytics once the production site token is available; place the snippet in the root layout only.

---

## SEO Rules

- Every public route sets a unique title, description, canonical URL, and Open Graph data in `<svelte:head>`.
- Use values from `src/lib/config/site.ts`; never hardcode the site URL elsewhere.
- Add JSON-LD through `src/lib/components/seo/` for services and articles when those pages are created.
- Place OG images in `static/images/og/` or use the approved public R2 media domain.
- Give every meaningful user-facing landmark a stable, unique HTML `id`: navigation areas, headers, full sections, carousels, tables, tab lists and their panels, and linkable content blocks. This supports direct linking, in-page navigation, crawler understanding, and search-result/AI-summary deep links.
- Use descriptive kebab-case IDs such as `services-overview`, `portfolio-carousel`, and `retouching-pricing-table`. IDs must be unique and stable across renders; do not generate random IDs or add IDs to purely decorative wrappers.

---

## TypeScript and Style

- Always use TypeScript; no JavaScript application files.
- Use meaningful, self-describing names. Use `camelCase` for values/functions and `PascalCase` for components/types.
- Do not use `any`, unsafe casts, or type predicates to bypass a type problem.
- Use `lucide-svelte` for icons.
- Use Tailwind tokens and CSS theme tokens. Do not use raw hex values in component markup.
- Keep comments minimal and only for complex reasoning.

---

## What Not To Do

- Do not put full section implementations in route files.
- Do not create custom code in `src/lib/components/ui/`.
- Do not hardcode repeated content inside components.
- Do not add packages when the current stack already covers the need.
- Do not create external API or database logic in browser components.
- Do not leave `console.log`, commented-out code, or TODO markers in production code.

---

## Code Review Format

```
Quality: [Acceptable / Good / Production-Ready]
Strengths:
Concerns:
AI-Code Risk: forced types · wrong layer · hardcoded data · animation cleanup · extra fetch · null path · style mismatch · client overuse · structure violation · magic string · raw color
```
