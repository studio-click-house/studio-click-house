# Studio Click House

Studio Click House is a SvelteKit marketing website for a creative studio specialising in image and video work. It is being built as a refined, motion-led visual experience that remains fast, accessible, SEO-friendly, and practical on lower-powered devices.

## Technology

- SvelteKit with Svelte 5 and TypeScript
- Tailwind CSS v4
- GSAP, ScrollTrigger, and Lenis
- shadcn-svelte and lucide-svelte
- Zod and sveltekit-superforms
- Private VPS hosting with the SvelteKit Node adapter
- Cloudflare R2 and its public media domain for images and video
- Bun for package management and scripts

## Prerequisites

- [Bun](https://bun.sh/) 1.2 or later
- A private VPS with Node.js 20+ for production hosting
- A Cloudflare account only for R2 media storage and its public media domain

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

## R2 media and VPS deployment

Cloudflare R2 stores portfolio media. Public images and videos should be delivered through the configured R2 public custom domain/CDN, not direct bucket URLs. `.env.example` documents the public media-domain variable used in local development; never commit `.env` files.

The website itself is deployed to the private VPS through `@sveltejs/adapter-node`. Build it with Bun, run the generated Node server behind the VPS reverse proxy, and set `ORIGIN` to the production URL.

```bash
bun run build
ORIGIN=https://studioclickhouse.com bun run start
```

Do not deploy before the VPS reverse proxy, production environment variables, and R2 media domain are configured.
