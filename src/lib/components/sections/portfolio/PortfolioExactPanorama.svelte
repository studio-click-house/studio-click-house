<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";

  let panoramaSection = $state<HTMLElement | null>(null);
  let sliderContainer = $state<HTMLElement | null>(null);
  let sliderPosition = $state(50);
  let isDragging = $state(false);

  interface InspectionItem {
    id: string;
    label: string;
    before: string;
    after: string;
    meta: string;
  }

  const items: InspectionItem[] = [
    {
      id: "timepiece",
      label: "Luxury Timepiece",
      before: "/images/services/all_images/jewelry-luxury-wrist-watch-studio-retouch-before.webp",
      after: "/images/services/all_images/jewelry-luxury-wrist-watch-studio-retouch-after.webp",
      meta: "Multi-Focus Stacking · 16-Bit Vector Paths · Micro-Scratch Polish",
    },
    {
      id: "bangle",
      label: "Sculptural Bangle",
      before: "/images/services/jewelry/jewelry-celine-gold-sculptural-bangle-03-before.webp",
      after: "/images/services/jewelry/jewelry-celine-gold-sculptural-bangle-03-after.webp",
      meta: "Specular Reflection Sculpting · Sub-Pixel Edge Extraction · Seamless Surface",
    },
    {
      id: "solitaire",
      label: "Emerald Solitaire",
      before: "/images/services/jewelry/jewelry-emerald-cut-diamond-solitaire-gold-ring-before.webp",
      after: "/images/services/jewelry/jewelry-emerald-cut-diamond-solitaire-gold-ring-after.webp",
      meta: "Gemstone Facet Clarity · Micro Dust Elimination · Prongs & Setting Polish",
    },
  ];

  let activeIndex = $state(0);
  let currentItem = $derived(items[activeIndex]);

  function updatePosition(clientX: number) {
    if (!sliderContainer) return;
    const rect = sliderContainer.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    sliderPosition = percent;
  }

  function handlePointerDown(e: PointerEvent) {
    isDragging = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDragging) return;
    updatePosition(e.clientX);
  }

  function handlePointerUp(e: PointerEvent) {
    if (!isDragging) return;
    isDragging = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if already released
    }
  }

  $effect(() => {
    if (!panoramaSection) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !panoramaSection) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add(
          {
            reduceMotion: "(prefers-reduced-motion: reduce)",
          },
          (ctx) => {
            if (ctx.conditions?.reduceMotion) return;

            gsap.from(".panorama-fade-item", {
              y: 24,
              autoAlpha: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power2.out",
              clearProps: "transform,opacity",
              scrollTrigger: {
                trigger: panoramaSection,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            });
          }
        );
        return () => media.revert();
      }, panoramaSection);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="portfolio-craft-panorama"
  bind:this={panoramaSection}
  aria-label="Interactive Macro Precision Retouching Inspector"
  class="relative w-full bg-brand-light py-14 sm:py-18 lg:py-22 overflow-hidden scroll-mt-20 sm:scroll-mt-28"
>
  <div class="site-shell relative z-10 max-w-5xl mx-auto">
    <!-- Top Bar: Title & Minimal Switcher -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 panorama-fade-item">
      <div>
        <p class="font-mono text-[0.64rem] font-bold uppercase tracking-[0.2em] text-brand-dark/50 mb-2">
          Macro Inspection
        </p>
        <h3 class="font-display text-2xl sm:text-3xl font-normal text-brand-dark tracking-tight">
          Fine Jewelry & Timepiece Refraction
        </h3>
      </div>

      <!-- Segmented Item Selector -->
      <div class="inline-flex p-1 rounded-xl bg-brand-dark/5 border border-brand-dark/10 self-start sm:self-auto">
        {#each items as item, i}
          <button
            type="button"
            onclick={() => { activeIndex = i; sliderPosition = 50; }}
            class="px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 {activeIndex === i ? 'bg-white text-brand-dark shadow-xs font-semibold' : 'text-brand-dark/60 hover:text-brand-dark'}"
          >
            {item.label}
          </button>
        {/each}
      </div>
    </div>

    <!-- The Interactive Split Stage -->
    <div
      bind:this={sliderContainer}
      onpointerdown={handlePointerDown}
      onpointermove={handlePointerMove}
      onpointerup={handlePointerUp}
      onpointercancel={handlePointerUp}
      role="slider"
      aria-label="Interactive Before and After Retouching Comparison"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin="0"
      aria-valuemax="100"
      tabindex="0"
      class="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[560px] rounded-2xl overflow-hidden border border-brand-dark/10 shadow-lg bg-neutral-900 cursor-ew-resize select-none touch-none panorama-fade-item"
    >
      <!-- Base Layer: Retouched Campaign Master -->
      <img
        src={currentItem.after}
        alt="{currentItem.label} finished master retouching"
        class="absolute inset-0 size-full object-cover object-center pointer-events-none"
        loading="lazy"
        decoding="async"
      />

      <!-- Clipped Top Layer: Untouched RAW Capture -->
      <div
        class="absolute inset-0 size-full overflow-hidden pointer-events-none"
        style="clip-path: polygon(0 0, {sliderPosition}% 0, {sliderPosition}% 100%, 0 100%);"
      >
        <img
          src={currentItem.before}
          alt="{currentItem.label} original studio capture"
          class="absolute inset-0 size-full object-cover object-center pointer-events-none"
          loading="lazy"
          decoding="async"
        />
      </div>

      <!-- Vertical Divider Line & Central Handle -->
      <div
        class="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none z-20"
        style="left: {sliderPosition}%;"
      >
        <div
          class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-9 rounded-full bg-brand-dark/95 text-brand-light flex items-center justify-center border border-white/40 shadow-xl backdrop-blur-xs font-mono text-[10px] tracking-tighter"
        >
          &lt;&gt;
        </div>
      </div>

      <!-- Top Badges: RAW vs Master -->
      <div class="absolute top-4 left-4 z-30 pointer-events-none">
        <span class="px-2.5 py-1 rounded-md bg-brand-dark/80 backdrop-blur-md text-white font-mono text-[0.62rem] uppercase tracking-wider font-medium border border-white/10">
          RAW Capture
        </span>
      </div>
      <div class="absolute top-4 right-4 z-30 pointer-events-none">
        <span class="px-2.5 py-1 rounded-md bg-brand-green/90 backdrop-blur-md text-white font-mono text-[0.62rem] uppercase tracking-wider font-semibold border border-white/10">
          Campaign Master
        </span>
      </div>

      <!-- Bottom Hint Bar -->
      <div class="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between text-white/80 font-mono text-[0.65rem] tracking-wider pointer-events-none drop-shadow-md">
        <span>Slide to inspect retouching depth</span>
        <span class="hidden sm:inline">Non-Destructive 16-Bit ProPhoto</span>
      </div>
    </div>

    <!-- Active Item Metadata Footer -->
    <div class="mt-4 flex items-center justify-between text-xs text-brand-dark/50 font-mono panorama-fade-item">
      <span>{currentItem.meta}</span>
      <span class="text-[0.68rem] uppercase tracking-wider text-brand-green font-medium">Studio Verified</span>
    </div>
  </div>
</section>
