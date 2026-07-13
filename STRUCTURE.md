# Studio Click House — SvelteKit Project Structure

## Stack

SvelteKit (Svelte 5), TypeScript, Tailwind CSS v4, GSAP, ScrollTrigger, Lenis, shadcn-svelte, lucide-svelte, Zod, sveltekit-superforms, Cloudflare R2/CDN/Web Analytics, and Bun.

```text
studio-click-house/
├── src/
│   ├── app.html                         # SvelteKit document shell
│   ├── app.css                          # Tailwind theme tokens and global styles
│   ├── app.d.ts                         # Application and Cloudflare types
│   ├── routes/                          # SvelteKit file-based routes
│   │   ├── +layout.svelte               # Root layout, global head, analytics when configured
│   │   ├── +page.svelte                 # Home route composition only
│   │   ├── about/
│   │   │   └── +page.svelte
│   │   ├── services/
│   │   │   ├── +page.svelte
│   │   │   └── [slug]/
│   │   │       └── +page.svelte
│   │   ├── portfolio/
│   │   │   └── +page.svelte
│   │   ├── pricing/
│   │   │   └── +page.svelte
│   │   ├── blog/
│   │   │   ├── +page.svelte
│   │   │   └── [slug]/
│   │   │       └── +page.svelte
│   │   ├── contact/
│   │   │   ├── +page.svelte
│   │   │   └── +page.server.ts          # Zod + Superforms action
│   │   ├── privacy/
│   │   │   └── +page.svelte
│   │   ├── terms/
│   │   │   └── +page.svelte
│   │   └── sitemap.xml/
│   │       └── +server.ts               # Generated public sitemap
│   └── lib/
│       ├── animations/
│       │   ├── gsap.ts                  # Shared GSAP/ScrollTrigger registration
│       │   └── lenis.ts                 # GSAP-ticker-integrated Lenis lifecycle helper
│       ├── components/
│       │   ├── layout/                  # Navbar, footer, page shell
│       │   ├── animations/              # Reusable animation components/actions
│       │   ├── sections/                # Full-width page sections
│       │   ├── common/                  # Cards, headings, small reusable parts
│       │   ├── seo/                     # JSON-LD/schema helpers
│       │   └── ui/                      # shadcn-svelte generated primitives only
│       ├── config/
│       │   └── site.ts                  # Site URL, name, social links, OG defaults
│       ├── content/                     # Services, FAQ, pricing, testimonials, posts
│       ├── hooks/                       # Reusable Svelte hooks/actions
│       ├── types/                       # Shared TypeScript interfaces
│       └── utils/                       # cn() and other shared utilities
├── static/
│   ├── images/                          # Fallback, OG, and non-R2 images
│   └── fonts/                           # Self-hosted font files
├── .dev.vars.example                    # Safe example local Cloudflare values
├── components.json                      # shadcn-svelte CLI configuration
├── svelte.config.js                     # SvelteKit + Cloudflare adapter
├── vite.config.ts                       # Vite + Tailwind CSS v4
├── wrangler.jsonc                       # Cloudflare Worker configuration
├── package.json                         # Bun scripts and dependencies
└── AGENTS.md                            # Repository coding rules
```

## Route conventions

| File | Responsibility |
| --- | --- |
| `+page.svelte` | Route UI that composes sections |
| `+layout.svelte` | Shared layout and route-level head content |
| `+page.server.ts` | Server loading and Superforms actions |
| `+server.ts` | HTTP endpoint |
| `+error.svelte` | Route error UI when needed |

## Content and visual media

Keep reusable copy and metadata in `src/lib/content/`. Store original portfolio images and videos in Cloudflare R2, then deliver them through the approved Cloudflare media domain. Keep only local fallback assets, fonts, and generated OG files in `static/`.

## Motion system

GSAP and ScrollTrigger are the site’s animation layer. Lenis provides one site-wide smooth-scroll instance, integrated with the GSAP ticker from the root layout layer. Shared setup lives in `src/lib/animations/`; page-specific animation remains close to the component it animates. Every GSAP context and the Lenis instance must be cleaned up on component destruction, and every experience must remain useful with reduced motion enabled.

## Page to section mapping

| Route | Planned sections |
| --- | --- |
| `/` | Hero, services, portfolio, process, proof, CTA |
| `/about` | Studio story, values, team, CTA |
| `/services` | Service overview and capability grid |
| `/services/[slug]` | Service hero, details, selected work, CTA |
| `/portfolio` | Filterable visual work and case studies |
| `/pricing` | Packages, scope guidance, FAQs, CTA |
| `/blog` | Article listing |
| `/blog/[slug]` | Article content and related work |
| `/contact` | Contact/consultation Superform |
