<script lang="ts">
  import { ArrowUpRight } from "lucide-svelte";
  import type { PortfolioPageData } from "$lib/types/portfolio";

  interface Props {
    cta: PortfolioPageData["cta"];
  }

  let { cta }: Props = $props();
</script>

<section
  id="portfolio-closing-cta"
  aria-labelledby="closing-cta-title"
  class="relative overflow-hidden bg-brand-light py-20 lg:py-32"
>
  <div class="site-shell max-w-4xl mx-auto text-center flex flex-col items-center">
    <div class="inline-flex items-center gap-2 rounded-full border border-brand-dark/15 bg-white px-3.5 py-1 mb-6 shadow-xs">
      <span class="size-2 rounded-full bg-brand-green"></span>
      <span class="font-mono text-xs font-semibold uppercase tracking-widest text-brand-dark">
        Initiate Production
      </span>
    </div>

    <h2
      id="closing-cta-title"
      class="font-display text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-brand-dark leading-[1] mb-6"
    >
      {cta.heading}
    </h2>

    <p class="text-base sm:text-lg text-brand-dark/75 leading-relaxed font-normal max-w-2xl mb-10">
      {cta.description}
    </p>

    <div class="flex flex-wrap items-center justify-center gap-4">
      <a
        href={cta.primaryHref}
        class="inline-flex items-center gap-2 rounded-xl bg-brand-green px-8 py-4 font-mono text-sm font-semibold uppercase tracking-wider text-white shadow-lg hover:bg-brand-green/90 transition-all hover:scale-105 active:scale-95"
      >
        <span>{cta.primaryLabel}</span>
        <ArrowUpRight class="size-4" />
      </a>
      <a
        href={cta.secondaryHref}
        class="inline-flex items-center gap-2 rounded-xl border border-brand-dark/20 bg-white px-8 py-4 font-mono text-sm font-semibold uppercase tracking-wider text-brand-dark hover:border-brand-dark transition-all hover:bg-brand-dark/5"
      >
        <span>{cta.secondaryLabel}</span>
      </a>
    </div>
  </div>
</section>
