# Studio Click House — Project Setup

This repository uses Bun and SvelteKit. It is an in-place migration from the former Next.js starter; do not recreate the repository or replace its Git and agent files.

## 1. Install Bun

Install Bun from [bun.sh](https://bun.sh/) if `bun --version` is not available, then restart the terminal so Bun is on your PATH.

## 2. Install project dependencies

```bash
bun install
```

This installs SvelteKit, Svelte 5, Tailwind CSS v4, GSAP, ScrollTrigger, Lenis, lucide-svelte, Zod, sveltekit-superforms, Cloudflare tooling, and the shadcn-svelte prerequisites.

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

## 7. Configure Cloudflare media

1. Create the production R2 bucket in Cloudflare.
2. Configure a public custom domain for media delivery through Cloudflare CDN.
3. Copy `.dev.vars.example` to `.dev.vars` for local values. Do not commit `.dev.vars`.
4. Add the real R2 binding to `wrangler.jsonc` only after the bucket name is confirmed.
5. Use the public media domain for browser-delivered portfolio images and video.

R2 has no configured bucket name yet, so this repository intentionally does not invent one.

## 8. Configure Cloudflare deployment

The repository uses `@sveltejs/adapter-cloudflare` and has a base `wrangler.jsonc` file.

```bash
bun run cf:dev
bun run cf:deploy
```

Before deployment, set the Cloudflare project/domain configuration and add the `nodejs_als` compatibility flag if it is not already inherited from `wrangler.jsonc`.

## 9. Configure Cloudflare Web Analytics

When the production analytics token is available, add its snippet to `src/routes/+layout.svelte`. Keep it in that one root location and do not add duplicate analytics scripts to pages or sections.
