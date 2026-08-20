<script lang="ts">
  import { X } from "lucide-svelte";
  import type {
    PortfolioGalleryItem,
    PortfolioCategory,
    PortfolioCategoryFilter,
  } from "$lib/types/portfolio";

  interface Props {
    items: PortfolioGalleryItem[];
    categories: PortfolioCategoryFilter[];
  }

  let { items, categories }: Props = $props();

  let activeCategory = $state<PortfolioCategory>("all");
  let selectedItem = $state<PortfolioGalleryItem | null>(null);

  const filteredItems = $derived(
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory),
  );

  function openLightbox(item: PortfolioGalleryItem) {
    selectedItem = item;
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  }

  function closeLightbox() {
    selectedItem = null;
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  }
</script>

<section
  id="portfolio-disciplines-tabbed"
  aria-labelledby="tabbed-disciplines-title"
  class="relative overflow-hidden bg-brand-light py-20 lg:py-32 border-b border-brand-dark/10"
>
  <div class="site-shell">
    <!-- Header & Horizontal Category Tabs -->
    <div class="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
      <span class="font-mono text-xs font-semibold uppercase tracking-widest text-brand-green mb-3">
        Disciplines & Scopes
      </span>
      <h2
        id="tabbed-disciplines-title"
        class="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-brand-dark leading-[1] mb-6"
      >
        Selected Deliverables by <span class="italic font-light text-brand-green">Discipline</span>
      </h2>
      <p class="text-sm sm:text-base text-brand-dark/70 font-normal">
        Filter through our primary service areas to inspect our standards across fashion, retail e-commerce, and high-volume commercial production.
      </p>

      <!-- Category Filter Tabs (Styled like clean segmented pill tabs) -->
      <nav class="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3" aria-label="Portfolio category filter">
        {#each categories as cat}
          <button
            type="button"
            onclick={() => (activeCategory = cat.id)}
            class="px-4 py-2 rounded-lg font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer border {activeCategory === cat.id ? 'bg-brand-dark text-brand-light border-brand-dark shadow-sm' : 'bg-white text-brand-dark/70 border-brand-dark/15 hover:border-brand-green hover:text-brand-green'}"
            aria-pressed={activeCategory === cat.id}
          >
            {cat.label}
          </button>
        {/each}
      </nav>
    </div>

    <!-- Tabbed Content Layout (Highlight metric card on the left + project cards on the right) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Metric Spotlight Card (Inspired by the big "26" number card in the reference image) -->
      <div class="lg:col-span-4 rounded-2xl border border-brand-dark/10 bg-white p-8 shadow-sm flex flex-col justify-between min-h-[340px]">
        <div>
          <span class="font-mono text-xs font-semibold uppercase tracking-widest text-brand-green">
            Discipline Archive
          </span>
          <div class="font-display text-7xl sm:text-8xl font-light text-brand-dark leading-none mt-4 mb-3">
            {filteredItems.length.toString().padStart(2, "0")}
          </div>
          <p class="text-sm text-brand-dark/75 leading-relaxed font-normal">
            Verified production assets currently cataloged under this discipline. Tested across multi-resolution outputs for global retail and editorial printing.
          </p>
        </div>
        <div class="pt-6 border-t border-brand-dark/10">
          <div class="flex items-center justify-between text-xs font-mono text-brand-dark/60">
            <span>Color Accuracy: 100%</span>
            <span class="text-brand-green font-semibold">SLA: On-Time</span>
          </div>
        </div>
      </div>

      <!-- Right Grid: Filtered Project Cards -->
      <div class="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {#each filteredItems.slice(0, 6) as item (item.id)}
          <div
            class="group rounded-xl overflow-hidden border border-brand-dark/10 bg-white shadow-xs transition-all duration-300 hover:shadow-lg hover:border-brand-green/40 flex flex-col"
          >
            <button
              type="button"
              onclick={() => openLightbox(item)}
              class="relative aspect-[4/3] w-full overflow-hidden bg-brand-dark/5 text-left cursor-pointer"
              aria-label="View {item.title}"
            >
              <img
                src={item.media.src}
                alt={item.media.alt}
                width={item.media.width}
                height={item.media.height}
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div class="absolute top-3 left-3 rounded-md bg-white/90 backdrop-blur-sm px-2 py-0.5 border border-brand-dark/10">
                <span class="font-mono text-[9px] uppercase tracking-widest text-brand-green font-semibold">
                  {item.category}
                </span>
              </div>
              <div class="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span class="rounded-full bg-white/90 px-3 py-1 font-mono text-xs font-semibold text-brand-dark shadow-sm">
                  Click to Expand
                </span>
              </div>
            </button>
            <div class="p-4 flex items-center justify-between">
              <h3 class="font-display text-base font-normal text-brand-dark truncate pr-2">
                {item.title}
              </h3>
              <span class="font-mono text-[10px] text-brand-dark/50 uppercase shrink-0">
                {item.aspectRatio}
              </span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Lightbox Modal -->
  {#if selectedItem}
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/90 p-4 backdrop-blur-md"
      onclick={closeLightbox}
      onkeydown={(e) => e.key === "Escape" && closeLightbox()}
      role="presentation"
      tabindex="-1"
    >
      <div
        class="relative max-w-4xl w-full max-h-[90dvh] flex flex-col items-center bg-white rounded-2xl overflow-hidden shadow-2xl border border-white/20 p-4 sm:p-6"
        onclick={(e) => e.stopPropagation()}
        onkeydown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
      >
        <button
          type="button"
          onclick={closeLightbox}
          class="absolute top-4 right-4 z-10 rounded-full bg-brand-dark/10 p-2 text-brand-dark hover:bg-brand-dark/20 transition-colors cursor-pointer"
          aria-label="Close image lightbox"
        >
          <X class="size-5" />
        </button>

        <div class="w-full max-h-[70dvh] flex items-center justify-center overflow-hidden rounded-xl bg-brand-dark/5">
          <img
            src={selectedItem.media.src}
            alt={selectedItem.media.alt}
            class="max-h-[70dvh] w-auto object-contain rounded-lg"
          />
        </div>

        <div class="w-full mt-4 flex items-center justify-between pt-3 border-t border-brand-dark/10">
          <div>
            <span class="font-mono text-[10px] uppercase tracking-widest text-brand-green font-semibold">
              {selectedItem.category}
            </span>
            <h4 class="font-display text-xl font-normal text-brand-dark">
              {selectedItem.title}
            </h4>
          </div>
          <span class="font-mono text-xs text-brand-dark/50">Studio Click House Archive</span>
        </div>
      </div>
    </div>
  {/if}
</section>
