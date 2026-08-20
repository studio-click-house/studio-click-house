<script lang="ts">
  import type { PortfolioPageData } from "$lib/types/portfolio";

  interface Props {
    brands: NonNullable<PortfolioPageData["brandPartners"]>;
  }

  let { brands }: Props = $props();
</script>

<section
  id="portfolio-brand-partners"
  aria-labelledby="brand-partners-title"
  class="relative overflow-hidden bg-brand-light py-16 lg:py-24 border-b border-brand-dark/10"
>
  <div class="site-shell">
    <div class="text-center mb-10">
      <span class="font-mono text-xs font-semibold uppercase tracking-widest text-brand-green block mb-2">
        Client Trust
      </span>
      <h2 id="brand-partners-title" class="font-display text-2xl sm:text-3xl font-normal text-brand-dark">
        Trusted by Global Fashion Houses & Studios
      </h2>
    </div>

    <!-- Client / Partner Logo Minimal Grid (Matching reference image sponsor layout) -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-brand-dark/10 border-y border-brand-dark/10">
      {#each brands as brand}
        <div class="flex flex-col items-center justify-center p-6 text-center group transition-colors hover:bg-white/60">
          <span class="font-display text-lg sm:text-xl font-normal text-brand-dark/70 tracking-tight group-hover:text-brand-dark transition-colors">
            {brand.name}
          </span>
          <span class="font-mono text-[10px] uppercase tracking-wider text-brand-dark/40 mt-1">
            {brand.category}
          </span>
        </div>
      {/each}
    </div>
  </div>
</section>
