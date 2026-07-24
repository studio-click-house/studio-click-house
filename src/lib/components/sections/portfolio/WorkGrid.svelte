<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type {
    PortfolioGalleryItem,
    PortfolioCategory,
  } from "$lib/types/portfolio";

  interface Props {
    items: PortfolioGalleryItem[];
    activeFilter: PortfolioCategory;
  }

  let { items, activeFilter }: Props = $props();

  let section: HTMLElement;
  let gridItems: HTMLElement[] = [];

  const filteredItems = $derived(
    activeFilter === "all"
      ? items
      : items.filter((item) => item.category === activeFilter),
  );

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
      const { gsap, ScrollTrigger } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          const headerWords = section.querySelectorAll(".grid-header-word");
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

          ScrollTrigger.batch(".work-grid-card", {
            start: "top 88%",
            onEnter: (batch) => {
              gsap.fromTo(
                batch,
                { autoAlpha: 0, y: 48, scale: 0.94 },
                {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.85,
                  stagger: 0.08,
                  ease: "power3.out",
                },
              );
            },
            once: true,
          });
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

<section
  id="portfolio-work-grid"
  bind:this={section}
  aria-labelledby="work-grid-title"
  class="work-grid-section"
>
  <header class="work-grid-header site-shell">
    <div class="work-grid-header-rule">
      <p class="eyebrow text-brand-green">Full gallery</p>
      <p class="work-grid-meta">
        {filteredItems.length} {filteredItems.length === 1 ? "piece" : "pieces"}
      </p>
    </div>

    <h2 id="work-grid-title" class="work-grid-heading">
      <span class="work-grid-heading-mask"
        ><span class="grid-header-word">Every frame,</span></span
      >
      <span class="work-grid-heading-mask"
        ><span class="grid-header-word italic text-brand-green"
          >considered.</span
        ></span
      >
    </h2>
  </header>

  <div class="work-grid-stage site-shell">
    <div class="work-grid">
      {#each filteredItems as item, index (item.id)}
        <article
          bind:this={gridItems[index]}
          class="work-grid-card work-grid-card--{item.aspectRatio}"
        >
          <figure class="work-grid-figure">
            <img
              src={item.media.src}
              alt={item.media.alt}
              width={item.media.width}
              height={item.media.height}
              loading="lazy"
              decoding="async"
              class="work-grid-image"
            />
            <div class="work-grid-overlay">
              <span class="work-grid-overlay-category">{item.category}</span>
              <h3 class="work-grid-overlay-title">{item.title}</h3>
            </div>
          </figure>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .work-grid-section {
    position: relative;
    background: var(--color-brand-light);
    color: var(--color-brand-dark);
    overflow: clip;
  }

  .work-grid-header {
    padding-block: clamp(5rem, 8vw, 8rem) clamp(2rem, 4vw, 4rem);
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
    margin-top: clamp(2rem, 4vw, 4rem);
    font-family: var(--font-display);
    font-size: clamp(3.5rem, 7.5vw, 8.5rem);
    line-height: 0.88;
    letter-spacing: -0.05em;
    font-weight: 400;
  }

  .work-grid-heading-mask {
    display: block;
    overflow: hidden;
    padding-bottom: 0.1em;
  }

  .work-grid-heading-mask > span {
    display: block;
    transform-origin: left bottom;
    will-change: transform;
  }

  .work-grid-stage {
    padding-bottom: clamp(4rem, 7vw, 7rem);
  }

  .work-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .work-grid-card {
    will-change: transform, opacity;
  }

  .work-grid-card--tall {
    grid-row: span 2;
  }

  .work-grid-figure {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 16rem;
    overflow: hidden;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 10%, transparent);
    background: var(--color-brand-paper);
    cursor: pointer;
    border-radius: 1.5rem;
  }

  .work-grid-card--tall .work-grid-figure {
    min-height: 32rem;
  }

  .work-grid-card--wide .work-grid-figure {
    min-height: 16rem;
  }

  .work-grid-card--square .work-grid-figure {
    aspect-ratio: 1;
    min-height: 0;
  }

  .work-grid-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition:
      transform 650ms cubic-bezier(0.16, 1, 0.3, 1),
      filter 650ms ease;
  }

  .work-grid-figure:hover .work-grid-image {
    transform: scale(1.06) rotate(0.4deg);
  }

  .work-grid-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 1.25rem;
    background: linear-gradient(
      180deg,
      transparent 40%,
      rgba(32, 33, 31, 0.7) 100%
    );
    opacity: 0;
    transition: opacity 400ms ease;
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

  @media (min-width: 768px) {
    .work-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .work-grid-card--wide {
      grid-column: span 2;
    }

    .work-grid-figure {
      min-height: 20rem;
    }

    .work-grid-card--tall .work-grid-figure {
      min-height: 42rem;
    }
  }

  @media (min-width: 1280px) {
    .work-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 1.15rem;
    }

    .work-grid-figure {
      min-height: 22rem;
    }

    .work-grid-card--tall .work-grid-figure {
      min-height: 46rem;
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
  }
</style>
