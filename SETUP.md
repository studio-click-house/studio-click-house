# Studio Click House — Project Setup

This repository uses Bun and SvelteKit. It is an in-place migration from the former Next.js starter; do not recreate the repository or replace its Git and agent files.

## 1. Install Bun

Install Bun from [bun.sh](https://bun.sh/) if `bun --version` is not available, then restart the terminal so Bun is on your PATH.

## 2. Install project dependencies

```bash
bun install
```

This installs SvelteKit, Svelte 5, Tailwind CSS v4, GSAP, ScrollTrigger, Lenis, lucide-svelte, Zod, sveltekit-superforms, the Node deployment adapter, and the shadcn-svelte prerequisites.

## 3. Motion runtime

GSAP and ScrollTrigger power section-level motion. Lenis provides the single smooth-scroll instance and must be integrated with the GSAP ticker from the root layout layer. Do not initialize Lenis independently inside page sections.

## 4. Run locally

```bash
bun run dev
```

## 5. Validate the project

```bash
bun run check
bun run lint
bun run format:check
bun run build
```

## 6. Add shadcn-svelte components when needed

The project is configured for shadcn-svelte in `components.json`. Do not pre-install UI components that are not yet needed.

```bash
bun x shadcn-svelte@latest add button
```

Generated components belong in `src/lib/components/ui/`.

## 7. Configure Cloudflare R2 media

1. Create the production R2 bucket in Cloudflare.
2. Configure a public custom domain for media delivery through Cloudflare CDN.
3. Copy `.env.example` to `.env` for local values. Do not commit `.env`.
4. Use the public media domain for browser-delivered portfolio images and video.

The website runs on the VPS and does not need a Wrangler R2 binding. R2 credentials are only needed later if server-side code must read or write bucket objects.

## 8. Deploy to the private VPS

The repository uses `@sveltejs/adapter-node`. Build the app, then run the generated Node server behind the VPS reverse proxy.

```bash
bun install
bun run build
ORIGIN=https://studioclickhouse.com bun run start
```

Configure TLS and response compression in the VPS reverse proxy. If the proxy terminates HTTPS, set `ORIGIN` to the public HTTPS URL so form actions and canonical URLs resolve correctly.
