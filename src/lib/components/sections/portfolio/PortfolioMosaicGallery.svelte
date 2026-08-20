<script lang="ts">
  import { X } from "lucide-svelte";
  import type { PortfolioGalleryItem } from "$lib/types/portfolio";

  interface Props {
    items: PortfolioGalleryItem[];
  }

  let { items }: Props = $props();

  let selectedImage = $state<PortfolioGalleryItem | null>(null);

  function openImage(item: PortfolioGalleryItem) {
    selectedImage = item;
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  }

  function closeImage() {
    selectedImage = null;
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  }
</script>

<section
  id="portfolio-mosaic-gallery"
  aria-labelledby="mosaic-gallery-title"
  class="relative overflow-hidden bg-brand-light py-20 lg:py-32 border-b border-brand-dark/10"
>
  <div class="site-shell">
    <!-- Header with right-aligned title badge -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
      <div>
        <span class="font-mono text-xs font-semibold uppercase tracking-widest text-brand-green block mb-2">
          Visual Archive
        </span>
        <h2
          id="mosaic-gallery-title"
          class="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-brand-dark leading-[1]"
        >
          Selected <span class="italic font-light text-brand-green">Gallery</span> Mosaic
        </h2>
      </div>
      <div class="text-right">
        <span class="font-mono text-xs text-brand-dark/50 uppercase tracking-wider">
          Multi-Angle Craft / 2015–2026
        </span>
      </div>
    </div>

    <!-- Expressive Masonry / Mosaic Grid (Direct inspiration from reference image's Gallery grid) -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 auto-rows-[140px] sm:auto-rows-[180px]">
      {#each items.slice(0, 10) as item, index (item.id)}
        <div
          class="relative overflow-hidden rounded-xl border border-brand-dark/10 bg-white group cursor-pointer shadow-xs transition-all duration-300 hover:shadow-lg hover:border-brand-green/40 {index === 0 ? 'col-span-2 row-span-2' : index === 3 ? 'col-span-2 row-span-1' : index === 5 ? 'col-span-2 row-span-2' : index === 7 ? 'col-span-2 row-span-1' : 'col-span-1 row-span-1'}"
          onclick={() => openImage(item)}
          onkeydown={(e) => e.key === "Enter" && openImage(item)}
          role="button"
          tabindex="0"
          aria-label="View {item.title}"
        >
          <img
            src={item.media.src}
            alt={item.media.alt}
            width={item.media.width}
            height={item.media.height}
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
            <span class="font-mono text-[8px] uppercase tracking-wider text-brand-green font-semibold">
              {item.category}
            </span>
            <span class="font-display text-xs sm:text-sm font-light truncate">
              {item.title}
            </span>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Lightbox Modal -->
  {#if selectedImage}
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/90 p-4 backdrop-blur-md"
      onclick={closeImage}
      onkeydown={(e) => e.key === "Escape" && closeImage()}
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
          onclick={closeImage}
          class="absolute top-4 right-4 z-10 rounded-full bg-brand-dark/10 p-2 text-brand-dark hover:bg-brand-dark/20 transition-colors cursor-pointer"
          aria-label="Close lightbox"
        >
          <X class="size-5" />
        </button>

        <div class="w-full max-h-[70dvh] flex items-center justify-center overflow-hidden rounded-xl bg-brand-dark/5">
          <img
            src={selectedImage.media.src}
            alt={selectedImage.media.alt}
            class="max-h-[70dvh] w-auto object-contain rounded-lg"
          />
        </div>

        <div class="w-full mt-4 flex items-center justify-between pt-3 border-t border-brand-dark/10">
          <div>
            <span class="font-mono text-[10px] uppercase tracking-widest text-brand-green font-semibold">
              {selectedImage.category}
            </span>
            <h4 class="font-display text-xl font-normal text-brand-dark">
              {selectedImage.title}
            </h4>
          </div>
          <span class="font-mono text-xs text-brand-dark/50">Studio Click House Archive</span>
        </div>
      </div>
    </div>
  {/if}
</section>
