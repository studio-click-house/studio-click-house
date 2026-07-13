# Studio Click House

Studio Click House is a SvelteKit marketing website for a creative studio specialising in image and video work. It is being built as a refined, motion-led visual experience that remains fast, accessible, SEO-friendly, and practical on lower-powered devices.

## Technology

- SvelteKit with Svelte 5 and TypeScript
- Tailwind CSS v4
- GSAP, ScrollTrigger, and Lenis
- shadcn-svelte and lucide-svelte
- Zod and sveltekit-superforms
- Cloudflare Workers/Pages, R2, CDN, and Web Analytics
- Bun for package management and scripts

## Prerequisites

- [Bun](https://bun.sh/) 1.2 or later
- A Cloudflare account for deployment, R2, CDN, and analytics configuration

## Getting started

```bash
bun install
bun run dev
```

Open the local URL printed by Vite.

## Quality checks

```bash
bun run check
bun run lint
bun run format:check
bun run build
```

Preview a production build locally with:

```bash
bun run preview
```

## Project structure

```text
src/
  routes/                 SvelteKit routes, layouts, form actions, and endpoints
  lib/
    components/           Layout, animation, section, common, SEO, and shadcn-svelte UI components
    animations/           GSAP, ScrollTrigger, and Lenis helpers
    config/               Site-wide configuration
    content/              Reused content and page data
    hooks/                Reusable Svelte hooks/actions
    types/                Shared TypeScript types
    utils/                Shared utilities
  app.css                 Tailwind theme and global styles
static/                   Static fallback assets and self-hosted fonts
```

For the complete convention guide, see [STRUCTURE.md](STRUCTURE.md). Agent implementation rules are in [AGENTS.md](AGENTS.md).

## Cloudflare media and deployment

Cloudflare R2 stores portfolio media. Public images and videos should be delivered through the configured Cloudflare custom domain/CDN, not direct bucket URLs. `.dev.vars.example` shows the public media-domain variable used in local development; never commit `.dev.vars`.

The repository is prepared for `@sveltejs/adapter-cloudflare`. Configure the real R2 bucket binding and Cloudflare Web Analytics token once those production resources exist.

```bash
bun run cf:dev
bun run cf:deploy
```

Do not deploy before the Cloudflare project, domain, and R2 bucket details have been configured.
