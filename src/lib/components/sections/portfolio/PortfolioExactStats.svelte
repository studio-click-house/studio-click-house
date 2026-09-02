<script lang="ts">
  import { _ } from "svelte-i18n";
</script>

<!-- Section 11: Numbers Row with Colons + Bottom Botanical Flourish (Exact Match to 9 : 60 : 250 : 50) -->
<section
  id="portfolio-glance-stats"
  aria-label="Studio at a Glance Statistics"
  class="relative w-full bg-brand-light py-16 lg:py-24 overflow-hidden"
>
  <div class="site-shell flex flex-col items-center text-center">
    <!-- Centered Small Eyebrow Title -->
    <span
      class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-green mb-8 block"
    >
      {$_('portfolio.stats.eyebrow') || 'Studio at a Glance'}
    </span>

    <!-- 4 Numbers with Colons (Exact format from reference image) -->
    <div
      class="flex flex-wrap items-center justify-center gap-4 sm:gap-8 lg:gap-12 mb-12"
    >
      <!-- Number 1: 9 -->
      <div class="flex flex-col items-center">
        <div
          class="font-display text-5xl sm:text-7xl lg:text-8xl font-normal text-brand-dark leading-none"
        >
          9
        </div>
        <span
          class="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-brand-dark/60 mt-2"
        >
          {$_('portfolio.stats.craft') || 'Craft'}
        </span>
      </div>

      <span
        class="font-display text-4xl sm:text-6xl text-brand-green font-light select-none pb-4"
        >:</span
      >

      <!-- Number 2: 60 -->
      <div class="flex flex-col items-center">
        <div
          class="font-display text-5xl sm:text-7xl lg:text-8xl font-normal text-brand-dark leading-none"
        >
          60
        </div>
        <span
          class="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-brand-dark/60 mt-2"
        >
          {$_('portfolio.stats.color') || 'Color'}
        </span>
      </div>

      <span
        class="font-display text-4xl sm:text-6xl text-brand-green font-light select-none pb-4"
        >:</span
      >

      <!-- Number 3: 250 -->
      <div class="flex flex-col items-center">
        <div
          class="font-display text-5xl sm:text-7xl lg:text-8xl font-normal text-brand-dark leading-none"
        >
          250
        </div>
        <span
          class="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-brand-dark/60 mt-2"
        >
          {$_('portfolio.stats.detail') || 'Detail'}
        </span>
      </div>

      <span
        class="font-display text-4xl sm:text-6xl text-brand-green font-light select-none pb-4"
        >:</span
      >

      <!-- Number 4: 50 -->
      <div class="flex flex-col items-center">
        <div
          class="font-display text-5xl sm:text-7xl lg:text-8xl font-normal text-brand-dark leading-none"
        >
          50
        </div>
        <span
          class="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-brand-dark/60 mt-2"
        >
          {$_('portfolio.stats.finish') || 'Finish'}
        </span>
      </div>
    </div>

    <!-- Centered Bottom Botanical Illustration Motif matching reference image footer -->
    <div class="mt-8 flex flex-col items-center text-brand-green opacity-90">
      <svg
        class="h-20 w-48"
        viewBox="0 0 192 80"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <path
          d="M96 68C96 46 96 28 96 8"
          stroke-dasharray="2 2"
          opacity="0.6"
        />
        <path d="M96 52C82 46 70 38 62 25C76 25 88 32 96 52Z" />
        <path d="M96 42C110 36 122 28 130 15C116 15 104 22 96 42Z" />
        <path d="M96 60C86 56 78 50 72 42C82 42 90 47 96 60Z" />
        <path d="M96 56C106 52 114 46 120 38C110 38 102 43 96 56Z" />
        <circle cx="96" cy="8" r="3" fill="currentColor" />
        <path d="M50 74C80 74 112 74 142 74" opacity="0.3" />
      </svg>
      <span
        class="font-mono text-[11px] uppercase tracking-[0.25em] text-brand-green font-semibold mt-2"
      >
        Studio Click House
      </span>
    </div>
  </div>
</section>
