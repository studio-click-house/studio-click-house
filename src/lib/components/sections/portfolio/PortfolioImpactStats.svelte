<script lang="ts">
  import type { PortfolioStat } from "$lib/types/portfolio";

  interface Props {
    stats: PortfolioStat[];
  }

  let { stats }: Props = $props();
</script>

<section
  id="portfolio-impact-metrics"
  aria-label="Studio Impact Statistics"
  class="relative overflow-hidden bg-brand-light py-16 lg:py-24 border-b border-brand-dark/10"
>
  <div class="site-shell">
    <div class="text-center mb-8">
      <span class="font-mono text-xs font-semibold uppercase tracking-widest text-brand-green">
        Scale & Reliability
      </span>
    </div>

    <!-- Numbers Counter Grid with subtle colons (Matching bottom numbers in reference image) -->
    <div class="flex flex-wrap items-center justify-center gap-6 sm:gap-12 lg:gap-16">
      {#each stats as stat, index}
        <div class="flex items-center gap-6 sm:gap-12 lg:gap-16">
          <div class="flex flex-col items-center text-center">
            <div class="font-display text-5xl sm:text-7xl lg:text-8xl font-normal text-brand-dark leading-none">
              <span>{stat.value}</span><span class="text-brand-green font-light">{stat.suffix}</span>
            </div>
            <span class="font-mono text-xs sm:text-sm uppercase tracking-wider text-brand-dark/60 mt-3">
              {stat.label}
            </span>
          </div>

          {#if index < stats.length - 1}
            <span class="hidden md:block font-display text-4xl text-brand-dark/20 font-light select-none">
              :
            </span>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>
