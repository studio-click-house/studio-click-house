<script lang="ts">
  import AboutOrbitGallery from "$lib/components/sections/about/AboutOrbitGallery.svelte";
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
</script>

<PageMeta
  title="Orbit Radial Animation Demo | Studio Click House"
  description="Standalone preview of the radial orbit pinning scroll animation."
  canonicalPath="/orbit-demo"
/>

<main class="min-h-screen bg-brand-dark text-brand-light">
  <div
    class="site-shell flex flex-col items-center justify-center py-20 text-center"
  >
    <span class="font-mono text-xs uppercase tracking-[0.2em] text-brand-green">
      Design Demo
    </span>
    <h1
      class="mt-2 font-display text-4xl font-light text-brand-light sm:text-6xl"
    >
      Radial Orbit Scroll Showcase
    </h1>
    <p class="mt-3 max-w-md text-sm text-brand-light/60">
      Scroll down below to see the interactive radial card expansion & center
      text reveal.
    </p>
  </div>

  <AboutOrbitGallery />

  <div
    class="site-shell flex flex-col items-center justify-center py-24 text-center border-t border-brand-light/10"
  >
    <p
      class="font-mono text-xs uppercase tracking-[0.16em] text-brand-light/50"
    >
      End of Demo
    </p>
    <a
      href="/about"
      class="mt-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-green hover:underline"
    >
      ← Return to About Page
    </a>
  </div>
</main>
