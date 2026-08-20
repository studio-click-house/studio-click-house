<script lang="ts">
  import type { PortfolioPageData } from "$lib/types/portfolio";

  interface Props {
    manifesto: NonNullable<PortfolioPageData["manifesto"]>;
  }

  let { manifesto }: Props = $props();
</script>

<section
  id="portfolio-manifesto"
  aria-label="Studio Manifesto"
  class="relative overflow-hidden bg-brand-light py-20 lg:py-32 border-b border-brand-dark/10 text-center"
>
  <div class="site-shell max-w-4xl mx-auto flex flex-col items-center">
    <!-- Studio Accent Monogram / Emblem -->
    <div class="mb-8 flex flex-col items-center gap-2">
      <div class="size-12 rounded-full border border-brand-green/30 bg-brand-green/10 flex items-center justify-center text-brand-green font-display text-xl">
        ✦
      </div>
      <span class="font-mono text-xs font-semibold uppercase tracking-widest text-brand-green">
        Philosophy of Craft
      </span>
    </div>

    <!-- Editorial Serif Quotation -->
    <blockquote class="font-display text-2xl sm:text-4xl lg:text-5xl font-normal leading-[1.25] text-brand-dark tracking-tight mb-8">
      “{manifesto.quote}”
    </blockquote>

    <div class="flex flex-col items-center">
      <cite class="not-italic font-mono text-xs font-semibold uppercase tracking-widest text-brand-dark">
        {manifesto.author}
      </cite>
      <span class="font-mono text-[11px] text-brand-dark/50 mt-1">
        {manifesto.role}
      </span>
    </div>
  </div>
</section>
