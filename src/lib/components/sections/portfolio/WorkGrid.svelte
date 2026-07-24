<script lang="ts">
  import { X } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type {
    PortfolioGalleryItem,
    PortfolioCategory,
  } from "$lib/types/portfolio";

  interface Props {
    items: PortfolioGalleryItem[];
  }

  let { items }: Props = $props();

  let section: HTMLElement;

  // Responsive column count
  let numCols = $state(2);

  $effect(() => {
    if (typeof window === 'undefined') return;
    const update = () => {
      if (window.innerWidth >= 1280) numCols = 4;
      else if (window.innerWidth >= 768) numCols = 3;
      else numCols = 2;
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  });

  function distributeColumns(
    items: PortfolioGalleryItem[],
    n: number
  ): PortfolioGalleryItem[][] {
    const cols: PortfolioGalleryItem[][] = Array.from({ length: n }, () => []);
    items.forEach((item, i) => cols[i % n].push(item));
    return cols;
  }

  let activeFilter = $state<PortfolioCategory>("all");
  let visibleCount = $state(12);
  let isLightboxOpen = $state(false);
  let selectedItem = $state<PortfolioGalleryItem | null>(null);

  const categories = [
    { id: "all", label: "All Work" },
    { id: "clipping-path", label: "Clipping Path (CP)" },
    { id: "multipath", label: "Multipath" },
    { id: "ghost-mannequin", label: "Ghost Mannequin & 3D Neck" },
    { id: "retouching", label: "High-End Retouch" },
    { id: "color-correction", label: "Color Correction & Change" },
    { id: "background-erase", label: "Background Erase & Shadow" },
    { id: "pattern-change", label: "Pattern & Language Change" },
    { id: "illustrator-banner", label: "Illustrator & Banner" },
  ] as const;

  const filteredItems = $derived(
    activeFilter === "all"
      ? items
      : items.filter((item) => item.category === activeFilter),
  );

  const visibleItems = $derived(filteredItems.slice(0, visibleCount));
  const columnItems = $derived(distributeColumns(visibleItems, numCols));

  function selectFilter(filter: PortfolioCategory) {
    activeFilter = filter;
    visibleCount = 12;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeLightbox();
    }
  }

  function openLightbox(item: PortfolioGalleryItem) {
    selectedItem = item;
    isLightboxOpen = true;
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  }

  function closeLightbox() {
    isLightboxOpen = false;
    selectedItem = null;
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  }

  // 1. One-time animation for section header title ("Our Work")
  $effect(() => {
    if (!section) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          const headerWords = section.querySelectorAll(".grid-header-word");
          if (headerWords.length > 0) {
            gsap.from(headerWords, {
              yPercent: 110,
              rotation: 2,
              duration: 1.1,
              stagger: 0.1,
              ease: "power4.out",
              scrollTrigger: {
                trigger: section,
                start: "top 78%",
                toggleActions: "play none none reverse",
              },
            });
          }
        });
        return () => media.revert();
      }, section);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });

  // 2. Animation for grid cards (re-evaluates on filter/item changes without touching header)
  $effect(() => {
    const _len = visibleItems.length;
    const _filter = activeFilter;
    
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
      const { gsap, ScrollTrigger } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          const cards = section.querySelectorAll(".work-grid-card");
          if (cards.length > 0) {
            ScrollTrigger.batch(cards, {
              start: "top 92%",
              onEnter: (batch) => {
                gsap.fromTo(
                  batch,
                  { autoAlpha: 0, y: 50, scale: 0.96 },
                  {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.85,
                    stagger: 0.08,
                    ease: "power3.out",
                    overwrite: "auto",
                  },
                );
              },
              once: true,
            });

            // Parallax scroll effect on images inside cards
            cards.forEach((card) => {
              const img = card.querySelector(".work-grid-image");
              if (img) {
                gsap.fromTo(
                  img,
                  { yPercent: -8 },
                  {
                    yPercent: 8,
                    ease: "none",
                    scrollTrigger: {
                      trigger: card,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: true,
                    },
                  }
                );
              }
            });
          }
        });

        return () => media.revert();
      }, section);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<svelte:window onkeydown={handleKeyDown} />

<section
  id="portfolio-work-grid"
  bind:this={section}
  aria-labelledby="work-grid-title"
  class="work-grid-section"
>
  <header class="work-grid-header site-shell">
    <h2 id="work-grid-title" class="work-grid-heading">
      <span class="work-grid-heading-mask">
        <span class="grid-header-word">Our</span>
        <span class="grid-header-word italic text-brand-green">Work</span>
      </span>
    </h2>

    <!-- Categories Filter Navigation -->
    <nav class="work-grid-filters" aria-label="Work gallery filters">
      {#each categories as category (category.id)}
        <button
          type="button"
          onclick={() => selectFilter(category.id)}
          class="work-grid-filter-pill"
          class:active={activeFilter === category.id}
          aria-pressed={activeFilter === category.id}
        >
          {category.label}
        </button>
      {/each}
    </nav>
  </header>

  <div class="work-grid-stage site-shell">
    <div class="work-grid">
      {#each columnItems as col, colIndex}
        <div class="work-grid-col">
          {#each col as item (item.id)}
            <article class="work-grid-card work-grid-card--{item.aspectRatio}">
              <button
                type="button"
                class="work-grid-figure"
                style="aspect-ratio: {item.media.width} / {item.media.height};"
                onclick={() => openLightbox(item)}
                aria-label="View large version of {item.title}"
              >
                <div class="work-grid-image-wrap">
                  <img
                    src={item.media.src}
                    alt={item.media.alt}
                    width={item.media.width}
                    height={item.media.height}
                    loading="lazy"
                    decoding="async"
                    class="work-grid-image"
                  />
                </div>
                <span class="work-grid-overlay">
                  <span class="work-grid-overlay-category">{item.category}</span>
                  <span class="work-grid-overlay-title">{item.title}</span>
                </span>
              </button>
            </article>
          {/each}
        </div>
      {/each}
    </div>

    <!-- Load More Button -->
    {#if filteredItems.length > visibleCount}
      <div class="work-grid-load-more">
        <button
          type="button"
          onclick={() => (visibleCount += 6)}
          class="load-more-btn"
        >
          Load More
        </button>
      </div>
    {/if}
  </div>

  <!-- Lightbox Modal -->
  {#if isLightboxOpen && selectedItem}
    <div
      class="lightbox-backdrop"
      onclick={closeLightbox}
      onkeydown={(e) => e.key === "Escape" && closeLightbox()}
      role="presentation"
      tabindex="-1"
    >
      <div
        class="lightbox-content"
        onclick={(e) => e.stopPropagation()}
        onkeydown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Image lightbox"
        tabindex="-1"
      >
        <button
          type="button"
          class="lightbox-close"
          onclick={closeLightbox}
          aria-label="Close image overlay"
        >
          <X size={24} />
        </button>
        <figure class="lightbox-figure">
          <img
            src={selectedItem.media.src}
            alt={selectedItem.media.alt}
            class="lightbox-image"
          />
          <figcaption class="lightbox-caption">
            <span class="lightbox-category">{selectedItem.category}</span>
            <h4 class="lightbox-title">{selectedItem.title}</h4>
          </figcaption>
        </figure>
      </div>
    </div>
  {/if}
</section>

<style>
  .work-grid-section {
    position: relative;
    background: var(--color-brand-light);
    color: var(--color-brand-dark);
    overflow: clip;
  }

  .work-grid-header {
    padding-block: clamp(4rem, 6vw, 6rem) clamp(2rem, 4vw, 3.5rem);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .work-grid-header-rule {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border-block: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 14%, transparent);
    padding-block: 1.1rem;
  }

  .work-grid-meta {
    font-family: var(--font-mono);
    font-size: 0.55rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: color-mix(in srgb, var(--color-brand-dark) 45%, transparent);
  }

  .work-grid-heading {
    font-family: var(--font-display);
    font-size: clamp(3.5rem, 7.5vw, 8.5rem);
    line-height: 0.9;
    letter-spacing: -0.05em;
    font-weight: 400;
    text-align: center;
  }

  .work-grid-heading-mask {
    display: inline-flex;
    gap: 0.3em;
    align-items: baseline;
    justify-content: center;
    overflow: hidden;
    padding-bottom: 0.1em;
  }

  .work-grid-heading-mask > span {
    display: inline-block;
    transform-origin: left bottom;
    will-change: transform;
  }

  .work-grid-stage {
    padding-bottom: clamp(4rem, 7vw, 7rem);
  }

  /* ── Zero-gap staggered masonry layout ── */
  .work-grid {
    display: flex;
    align-items: flex-start;
    gap: 0;
  }

  .work-grid-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: 0;
  }

  /*
   * Vertical stagger for top edges of columns
   */
  .work-grid-col:nth-child(1) { margin-top: 0; }
  .work-grid-col:nth-child(2) { margin-top: clamp(30px, 4vw, 60px); }
  .work-grid-col:nth-child(3) { margin-top: clamp(10px, 2vw, 30px); }
  .work-grid-col:nth-child(4) { margin-top: clamp(40px, 6vw, 80px); }

  .work-grid-card {
    display: block;
    width: 100%;
    margin: 0;
    padding: clamp(4px, 0.5vw, 8px);
    box-sizing: border-box;
    will-change: transform, opacity;
  }

  /*
   * Edge staggering — only adjust outer left/right edges.
   * Inner edges stay at 0/100% so columns snap directly against each other with ZERO gaps.
   */

  /* Leftmost Column (Col 1) — uneven outer left edge */
  .work-grid-col:nth-child(1) .work-grid-card:nth-child(3n + 1) {
    margin-left: 0;
    width: 100%;
  }
  .work-grid-col:nth-child(1) .work-grid-card:nth-child(3n + 2) {
    margin-left: clamp(-2.5rem, -3vw, -1.25rem);
    width: calc(100% + clamp(1.25rem, 3vw, 2.5rem));
  }
  .work-grid-col:nth-child(1) .work-grid-card:nth-child(3n + 3) {
    margin-left: clamp(1rem, 2vw, 1.75rem);
    width: calc(100% - clamp(1rem, 2vw, 1.75rem));
  }

  /* Rightmost Column (Col 4 in 4-col layout / Col 2 on mobile) — uneven outer right edge */
  .work-grid-col:last-child .work-grid-card:nth-child(3n + 1) {
    width: 100%;
  }
  .work-grid-col:last-child .work-grid-card:nth-child(3n + 2) {
    width: calc(100% + clamp(1.25rem, 3vw, 2.5rem));
  }
  .work-grid-col:last-child .work-grid-card:nth-child(3n + 3) {
    width: calc(100% - clamp(1rem, 2vw, 1.75rem));
  }

  .work-grid-figure {
    display: block;
    position: relative;
    width: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
    background: var(--color-brand-paper);
    cursor: pointer;
    text-align: left;
  }



  .work-grid-image-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .work-grid-figure:hover .work-grid-image-wrap {
    transform: scale(1.05);
  }

  .work-grid-image {
    position: absolute;
    top: -10%;
    left: 0;
    width: 100%;
    height: 120%;
    display: block;
    object-fit: cover;
    will-change: transform;
    transition: filter 650ms ease;
  }

  .work-grid-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: clamp(1rem, 2vw, 1.75rem);
    background: linear-gradient(
      180deg,
      transparent 35%,
      rgba(32, 33, 31, 0.85) 100%
    );
    opacity: 0;
    transition: opacity 350ms ease;
  }

  .work-grid-figure:hover .work-grid-overlay {
    opacity: 1;
  }

  .work-grid-overlay-category {
    font-family: var(--font-mono);
    font-size: 0.5rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-brand-green);
  }

  .work-grid-overlay-title {
    margin-top: 0.35rem;
    font-family: var(--font-display);
    font-size: clamp(1.1rem, 1.4vw, 1.5rem);
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--color-brand-light);
  }



  .work-grid-filters {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
    margin-top: clamp(2rem, 4vh, 3.5rem);
  }

  .work-grid-filter-pill {
    padding: 0.75rem 1.6rem;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 18%, transparent);
    border-radius: 999px;
    background: transparent;
    color: color-mix(in srgb, var(--color-brand-dark) 75%, transparent);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition:
      background 280ms ease,
      color 280ms ease,
      border-color 280ms ease,
      transform 280ms ease,
      box-shadow 280ms ease;
  }

  .work-grid-filter-pill:hover {
    border-color: var(--color-brand-green);
    color: var(--color-brand-green);
    transform: translateY(-2px);
  }

  .work-grid-filter-pill.active {
    background: var(--color-brand-green);
    border-color: var(--color-brand-green);
    color: var(--color-brand-light);
    box-shadow: 0 6px 20px rgba(126, 166, 65, 0.3);
  }

  .work-grid-load-more {
    display: flex;
    justify-content: center;
    margin-top: clamp(3rem, 6vw, 5rem);
  }

  .load-more-btn {
    padding: 0.85rem 2.25rem;
    border: 1px solid var(--color-brand-dark);
    border-radius: 999px;
    background: transparent;
    color: var(--color-brand-dark);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    transition:
      background-color 300ms cubic-bezier(0.16, 1, 0.3, 1),
      color 300ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .load-more-btn:hover {
    background-color: var(--color-brand-dark);
    color: var(--color-brand-light);
    transform: translateY(-2px);
  }

  .load-more-btn:active {
    transform: translateY(0);
  }

  .lightbox-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(32, 29, 28, 0.95);
    backdrop-filter: blur(8px);
    cursor: zoom-out;
    animation: fadeIn 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .lightbox-content {
    position: relative;
    width: 90%;
    max-width: 64rem;
    max-height: 85dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: default;
    animation: zoomUp 380ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .lightbox-close {
    position: absolute;
    top: -3.5rem;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border: 1px solid rgba(248, 248, 246, 0.2);
    border-radius: 50%;
    background: rgba(248, 248, 246, 0.05);
    color: var(--color-brand-light);
    cursor: pointer;
    transition:
      background 280ms ease,
      color 280ms ease,
      transform 280ms ease;
  }

  .lightbox-close:hover {
    background: var(--color-brand-light);
    color: var(--color-brand-dark);
    transform: scale(1.05) rotate(90deg);
  }

  .lightbox-figure {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .lightbox-image {
    max-width: 100%;
    max-height: 70dvh;
    object-fit: contain;
    border-radius: 1.5rem;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(248, 248, 246, 0.1);
  }

  .lightbox-caption {
    margin-top: 1.5rem;
    text-align: center;
    color: var(--color-brand-light);
  }

  .lightbox-category {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--color-brand-green);
  }

  .lightbox-title {
    margin-top: 0.5rem;
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 2.5vw, 2.25rem);
    font-weight: 300;
    letter-spacing: -0.02em;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes zoomUp {
    from {
      opacity: 0;
      transform: scale(0.92);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .work-grid-card {
      will-change: auto;
      opacity: 1 !important;
      transform: none !important;
    }

    .work-grid-image {
      transition: none;
    }

    .work-grid-overlay {
      opacity: 1;
      background: linear-gradient(
        180deg,
        transparent 60%,
        rgba(32, 33, 31, 0.55) 100%
      );
    }

    .lightbox-backdrop,
    .lightbox-content {
      animation: none !important;
    }
  }
</style>
