<script lang="ts">
  import { page } from "$app/state";
  import { resolve } from "$app/paths";
  import { ArrowLeft, ArrowUpRight } from "lucide-svelte";
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import { _ } from "svelte-i18n";

  const status = $derived(page.status ?? 404);
  const is404 = $derived(status === 404);
</script>

<PageMeta
  title={`${status} — Page Not Found | Studio Click House`}
  description="The requested page could not be found. Return to Studio Click House to explore our image post-production services and portfolio."
  canonicalPath="/404"
/>

<main
  id="error-page"
  class="relative isolate min-h-[100dvh] overflow-hidden bg-brand-dark px-4 pt-32 pb-24 text-brand-light flex items-center justify-center"
>
  <!-- Ambient background glow -->
  <div
    class="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[36rem] rounded-full bg-brand-green/12 blur-[140px]"
    aria-hidden="true"
  ></div>

  <div class="site-shell relative z-10 mx-auto max-w-2xl text-center">
    <span
      class="inline-block rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand-green"
    >
      {$_('error.statusBadge') || 'Error'} {status}
    </span>

    <h1
      class="mt-6 font-display text-[clamp(2.8rem,5.5vw,5.2rem)] font-light leading-[0.95] tracking-[-0.04em]"
    >
      {#if is404}
        {$_('error.title404') || 'Page Not Found'}
      {:else}
        {$_('error.title500') || 'Unexpected Error'}
      {/if}
    </h1>

    <p
      class="mx-auto mt-6 max-w-lg text-base leading-7 text-brand-light/65 sm:text-lg"
    >
      {#if is404}
        {$_('error.desc404') || 'The visual or page you are looking for has been moved, renamed, or does not exist.'}
      {:else}
        {$_('error.desc500') || 'An unexpected issue occurred while loading this page. Please try again later.'}
      {/if}
    </p>

    <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
      <a
        href={resolve("/")}
        class="group inline-flex min-h-12 items-center gap-3 rounded-[0.55rem] bg-brand-green px-6 text-sm font-semibold text-brand-dark transition-colors duration-300 hover:bg-brand-light focus-visible:outline-brand-green"
      >
        <ArrowLeft class="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
        {$_('error.backHome') || 'Return to Studio'}
      </a>
      <a
        href={resolve("/services")}
        class="group inline-flex min-h-12 items-center gap-3 rounded-[0.55rem] border border-brand-light/20 px-6 text-sm font-semibold text-brand-light transition-colors duration-300 hover:border-brand-green hover:text-brand-green"
      >
        {$_('error.exploreServices') || 'Explore Services'}
        <ArrowUpRight class="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  </div>
</main>
