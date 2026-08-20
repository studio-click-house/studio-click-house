<script lang="ts">
  import { Play } from "lucide-svelte";
  import type { PortfolioPageData } from "$lib/types/portfolio";

  interface Props {
    showreel: NonNullable<PortfolioPageData["showreel"]>;
  }

  let { showreel }: Props = $props();

  let isPlaying = $state(false);
</script>

<section
  id="portfolio-showreel"
  aria-labelledby="showreel-title"
  class="relative overflow-hidden bg-brand-light py-20 lg:py-32 border-b border-brand-dark/10"
>
  <div class="site-shell">
    <div class="max-w-3xl mb-12">
      <span class="font-mono text-xs font-semibold uppercase tracking-widest text-brand-green block mb-2">
        {showreel.subtitle}
      </span>
      <h2
        id="showreel-title"
        class="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-brand-dark leading-[1] mb-4"
      >
        {showreel.title}
      </h2>
      <p class="text-sm sm:text-base text-brand-dark/70 font-normal">
        {showreel.description}
      </p>
    </div>

    <!-- Cinematic Media Frame with Play Trigger (Inspired by video section in reference image) -->
    <div class="relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-brand-dark/10 shadow-2xl bg-brand-dark/5 aspect-[16/9] sm:aspect-[21/9]">
      <img
        src={showreel.media.src}
        alt={showreel.media.alt}
        width={showreel.media.width}
        height={showreel.media.height}
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover object-center"
      />
      <div class="absolute inset-0 bg-brand-dark/30 backdrop-blur-[1px] flex items-center justify-center">
        <button
          type="button"
          onclick={() => (isPlaying = !isPlaying)}
          class="size-16 sm:size-20 rounded-full bg-brand-green text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
          aria-label="Play 2026 Process Showreel"
        >
          <Play class="size-6 sm:size-8 fill-white translate-x-0.5" />
        </button>
      </div>

      <div class="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 rounded-lg bg-black/50 backdrop-blur-md px-3 py-1.5 text-white text-xs font-mono">
        4K Post-Production Master · 24fps
      </div>
    </div>
  </div>
</section>
