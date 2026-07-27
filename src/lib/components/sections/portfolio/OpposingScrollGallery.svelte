<script lang="ts">
  import { tick } from "svelte";
  import { Expand, X } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { PortfolioGalleryItem } from "$lib/types/portfolio";

  interface Props {
    items: PortfolioGalleryItem[];
  }

  let { items }: Props = $props();

  let section: HTMLElement;
  let upwardRail: HTMLDivElement;
  let downwardRail: HTMLDivElement;
  let lightboxFrame = $state<HTMLElement>();
  let lightboxCloseButton = $state<HTMLButtonElement>();
  let selectedItem = $state<PortfolioGalleryItem | null>(null);

  const galleryItems = $derived(items.slice(0, 10));
  const upwardItems = $derived(
    galleryItems.filter((_, index) => index % 2 === 0),
  );
  const downwardItems = $derived(
    galleryItems.filter((_, index) => index % 2 === 1),
  );

  let activeOpener: HTMLButtonElement | null = null;
  let sourceRect: DOMRect | null = null;
  let previousBodyOverflow = "";

  function formatCategory(category: string) {
    return category.replaceAll("-", " ");
  }

  async function openLightbox(item: PortfolioGalleryItem, event: MouseEvent) {
    if (!(event.currentTarget instanceof HTMLButtonElement)) return;

    activeOpener = event.currentTarget;
    sourceRect = activeOpener.getBoundingClientRect();
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    selectedItem = item;

    await tick();
    lightboxCloseButton?.focus();

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !sourceRect ||
      !lightboxFrame
    )
      return;

    const targetRect = lightboxFrame.getBoundingClientRect();
    const sourceCenterX = sourceRect.left + sourceRect.width / 2;
    const sourceCenterY = sourceRect.top + sourceRect.height / 2;
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    lightboxFrame.animate(
      [
        {
          opacity: 0.45,
          transform: `translate(${sourceCenterX - targetCenterX}px, ${sourceCenterY - targetCenterY}px) scale(${sourceRect.width / targetRect.width}, ${sourceRect.height / targetRect.height})`,
        },
        {
          opacity: 1,
          transform: "translate(0, 0) scale(1)",
        },
      ],
      {
        duration: 620,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "both",
      },
    );
  }

  function closeLightbox() {
    selectedItem = null;
    document.body.style.overflow = previousBodyOverflow;
    activeOpener?.focus();
    activeOpener = null;
    sourceRect = null;
  }

  function handleWindowKeydown(event: KeyboardEvent) {
    if (event.key === "Escape" && selectedItem) closeLightbox();
  }

  $effect(() => {
    if (!section || !upwardRail || !downwardRail) return;

    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;

      const { gsap, ScrollTrigger } = runtime;
      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add(
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          () => {
            const getTravel = (rail: HTMLElement) =>
              Math.max(0, rail.scrollHeight - window.innerHeight + 96);

            gsap
              .timeline({
                scrollTrigger: {
                  id: "portfolio-opposing-gallery",
                  trigger: section,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              })
              .fromTo(
                upwardRail,
                { y: () => -getTravel(upwardRail) },
                {
                  y: 0,
                  ease: "none",
                  force3D: true,
                },
                0,
              )
              .fromTo(
                downwardRail,
                { y: 0 },
                {
                  y: () => -getTravel(downwardRail),
                  ease: "none",
                  force3D: true,
                },
                0,
              );
          },
        );

        return () => media.revert();
      }, section);

      const images = Array.from(section.querySelectorAll("img"));
      void Promise.all(
        images.map((image) => image.decode().catch(() => undefined)),
      ).then(() => {
        if (active) ScrollTrigger.refresh();
      });
    });

    return () => {
      active = false;
      context?.revert();
      document.body.style.overflow = previousBodyOverflow;
    };
  });
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<section
  id="parallel-portfolio-gallery"
  bind:this={section}
  aria-labelledby="parallel-portfolio-heading"
  class="opposing-gallery"
>
  <div class="gallery-stage">
    <header class="gallery-intro">
      <p class="gallery-kicker">Parallel edit / Selected frames</p>
      <h2 id="parallel-portfolio-heading" class="gallery-heading">
        Two directions.<br />
        <span>One standard.</span>
      </h2>
      <p class="gallery-instruction">
        Scroll through the edit. Select any frame for a closer view.
      </p>
    </header>

    <div class="gallery-columns" aria-label="Selected portfolio gallery">
      <div bind:this={upwardRail} class="gallery-rail gallery-rail-up">
        {#each upwardItems as item, index (item.id)}
          <button
            type="button"
            class="gallery-card"
            class:gallery-card-offset={index % 2 === 1}
            onclick={(event) => openLightbox(item, event)}
            aria-label={`Open ${item.title}`}
            aria-haspopup="dialog"
          >
            <span class="gallery-image-frame">
              <img
                src={item.media.src}
                alt={item.media.alt}
                width={item.media.width}
                height={item.media.height}
                loading="lazy"
                decoding="async"
              />
            </span>
            <span class="gallery-card-meta">
              <span>{formatCategory(item.category)}</span>
              <span>{String(index * 2 + 1).padStart(2, "0")}</span>
            </span>
            <span class="gallery-card-title">{item.title}</span>
            <span class="gallery-expand" aria-hidden="true">
              <Expand size={18} strokeWidth={1.5} />
            </span>
          </button>
        {/each}
      </div>

      <div bind:this={downwardRail} class="gallery-rail gallery-rail-down">
        {#each downwardItems as item, index (item.id)}
          <button
            type="button"
            class="gallery-card"
            class:gallery-card-offset={index % 2 === 0}
            onclick={(event) => openLightbox(item, event)}
            aria-label={`Open ${item.title}`}
            aria-haspopup="dialog"
          >
            <span class="gallery-image-frame">
              <img
                src={item.media.src}
                alt={item.media.alt}
                width={item.media.width}
                height={item.media.height}
                loading="lazy"
                decoding="async"
              />
            </span>
            <span class="gallery-card-meta">
              <span>{formatCategory(item.category)}</span>
              <span>{String(index * 2 + 2).padStart(2, "0")}</span>
            </span>
            <span class="gallery-card-title">{item.title}</span>
            <span class="gallery-expand" aria-hidden="true">
              <Expand size={18} strokeWidth={1.5} />
            </span>
          </button>
        {/each}
      </div>
    </div>

    <div class="gallery-progress" aria-hidden="true">
      <span>Scroll</span>
      <span class="gallery-progress-line"></span>
    </div>
  </div>

  {#if selectedItem}
    <div
      class="gallery-lightbox"
      role="presentation"
      data-native-cursor
      data-cursor-trail="off"
      onclick={closeLightbox}
    >
      <div
        bind:this={lightboxFrame}
        class="lightbox-frame"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-lightbox-title"
        tabindex="-1"
        onclick={(event) => event.stopPropagation()}
        onkeydown={(event) => {
          event.stopPropagation();
          if (event.key === "Escape") closeLightbox();
        }}
      >
        <button
          bind:this={lightboxCloseButton}
          type="button"
          class="lightbox-close"
          onclick={closeLightbox}
          aria-label="Close image viewer"
        >
          <span>Close</span>
          <X size={20} strokeWidth={1.5} />
        </button>

        <figure class="lightbox-figure">
          <div class="lightbox-image-frame">
            <img
              src={selectedItem.media.src}
              alt={selectedItem.media.alt}
              width={selectedItem.media.width}
              height={selectedItem.media.height}
            />
          </div>
          <figcaption class="lightbox-caption">
            <p>{formatCategory(selectedItem.category)}</p>
            <h3 id="gallery-lightbox-title">{selectedItem.title}</h3>
          </figcaption>
        </figure>
      </div>
    </div>
  {/if}
</section>

<style>
  .opposing-gallery {
    position: relative;
    min-height: 300dvh;
    overflow: clip;
    color: var(--color-brand-light);
    background: var(--color-brand-dark);
  }

  .gallery-stage {
    position: sticky;
    top: 0;
    height: 100dvh;
    min-height: 42rem;
    overflow: hidden;
    isolation: isolate;
  }

  .gallery-stage::after {
    position: absolute;
    inset: 0;
    z-index: 2;
    background: linear-gradient(
      180deg,
      var(--color-brand-dark) 0,
      transparent 17%,
      transparent 81%,
      var(--color-brand-dark) 100%
    );
    pointer-events: none;
    content: "";
  }

  .gallery-intro {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 3;
    width: min(28rem, 34vw);
    text-align: center;
    pointer-events: none;
    transform: translate(-50%, -50%);
  }

  .gallery-kicker,
  .gallery-instruction,
  .gallery-card-meta,
  .lightbox-caption p,
  .gallery-progress {
    font-family: var(--font-mono);
    text-transform: uppercase;
  }

  .gallery-kicker {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: var(--color-brand-green);
  }

  .gallery-heading {
    margin-top: 1.15rem;
    font-family: var(--font-display);
    font-size: clamp(3.2rem, 6.2vw, 6.8rem);
    font-weight: 300;
    line-height: 0.82;
    letter-spacing: -0.055em;
  }

  .gallery-heading span {
    color: color-mix(in srgb, var(--color-brand-light) 48%, transparent);
    font-style: italic;
  }

  .gallery-instruction {
    max-width: 24rem;
    margin: 1.5rem auto 0;
    font-size: 0.58rem;
    line-height: 1.65;
    letter-spacing: 0.15em;
    color: color-mix(in srgb, var(--color-brand-light) 48%, transparent);
  }

  .gallery-columns {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: clamp(10rem, 25vw, 28rem);
    padding-inline: clamp(1.25rem, 4.5vw, 5.5rem);
  }

  .gallery-rail {
    display: flex;
    flex-direction: column;
    gap: clamp(2rem, 5vw, 5rem);
    padding-block: 12dvh;
    will-change: transform;
  }

  .gallery-card {
    position: relative;
    display: block;
    width: min(100%, 31rem);
    padding: 0;
    color: inherit;
    text-align: left;
    background: transparent;
    border: 0;
    cursor: pointer;
    transition:
      opacity 400ms ease,
      transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .gallery-rail-up .gallery-card {
    margin-right: auto;
  }

  .gallery-rail-down .gallery-card {
    margin-left: auto;
  }

  .gallery-card-offset {
    width: min(86%, 26rem);
  }

  .gallery-image-frame {
    display: block;
    overflow: hidden;
    aspect-ratio: 4 / 5;
    border-radius: 0.6rem;
    background: color-mix(in srgb, var(--color-brand-light) 7%, transparent);
    transition: transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .gallery-card:nth-child(3n + 2) .gallery-image-frame {
    aspect-ratio: 5 / 4;
  }

  .gallery-image-frame img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .gallery-card-meta {
    display: flex;
    justify-content: space-between;
    margin-top: 0.85rem;
    font-size: 0.56rem;
    letter-spacing: 0.16em;
    color: color-mix(in srgb, var(--color-brand-light) 42%, transparent);
  }

  .gallery-card-meta span:first-child {
    color: var(--color-brand-green);
  }

  .gallery-card-title {
    display: block;
    max-width: 88%;
    margin-top: 0.45rem;
    font-family: var(--font-display);
    font-size: clamp(1.3rem, 1.8vw, 2rem);
    line-height: 1;
  }

  .gallery-expand {
    position: absolute;
    right: 0;
    bottom: 0.15rem;
    opacity: 0;
    transform: scale(0.72);
    transition:
      opacity 260ms ease,
      transform 360ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .gallery-card:hover,
  .gallery-card:focus-visible {
    transform: scale(0.96);
  }

  .gallery-card:hover .gallery-image-frame,
  .gallery-card:focus-visible .gallery-image-frame {
    transform: scale(0.98);
  }

  .gallery-card:hover .gallery-image-frame img,
  .gallery-card:focus-visible .gallery-image-frame img {
    transform: scale(1.12);
  }

  .gallery-card:hover .gallery-expand,
  .gallery-card:focus-visible .gallery-expand {
    opacity: 1;
    transform: scale(1);
  }

  .gallery-card:focus-visible {
    outline: 2px solid var(--color-brand-green);
    outline-offset: 0.45rem;
  }

  .gallery-progress {
    position: absolute;
    right: clamp(1.25rem, 3vw, 3rem);
    bottom: 2rem;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.55rem;
    letter-spacing: 0.18em;
    color: color-mix(in srgb, var(--color-brand-light) 50%, transparent);
  }

  .gallery-progress-line {
    width: 3.5rem;
    height: 1px;
    background: color-mix(in srgb, var(--color-brand-light) 32%, transparent);
  }

  .gallery-lightbox {
    position: fixed;
    inset: 0;
    z-index: 300;
    display: grid;
    place-items: center;
    padding: clamp(1rem, 3vw, 3rem);
    background: color-mix(in srgb, var(--color-brand-dark) 94%, transparent);
    backdrop-filter: blur(0.45rem);
    animation: lightbox-backdrop-in 320ms ease both;
  }

  .lightbox-frame {
    position: relative;
    width: min(88rem, 100%);
    height: min(88dvh, 58rem);
    padding: clamp(0.8rem, 1.4vw, 1.4rem);
    color: var(--color-brand-dark);
    background: var(--color-brand-light);
    border-radius: 0.75rem;
    transform-origin: center;
  }

  .lightbox-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 0.8rem;
    font-family: var(--font-mono);
    font-size: 0.58rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--color-brand-light);
    background: var(--color-brand-dark);
    border: 0;
    border-radius: 999px;
    cursor: pointer;
  }

  .lightbox-close:focus-visible {
    outline: 2px solid var(--color-brand-green);
    outline-offset: 0.2rem;
  }

  .lightbox-figure {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(13rem, 22rem);
    gap: clamp(1rem, 2.5vw, 2.5rem);
    height: 100%;
    margin: 0;
  }

  .lightbox-image-frame {
    min-height: 0;
    overflow: hidden;
    border-radius: 0.45rem;
    background: var(--color-brand-dark);
  }

  .lightbox-image-frame img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .lightbox-caption {
    align-self: end;
    padding: 1rem 1rem 1.5rem 0;
  }

  .lightbox-caption p {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    color: var(--color-brand-green);
  }

  .lightbox-caption h3 {
    margin-top: 0.75rem;
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 4vw, 4.8rem);
    font-weight: 300;
    line-height: 0.9;
    letter-spacing: -0.045em;
  }

  @keyframes lightbox-backdrop-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 63.999rem) {
    .gallery-columns {
      gap: clamp(6rem, 20vw, 12rem);
      padding-inline: 1.5rem;
    }

    .gallery-intro {
      width: 38vw;
    }
  }

  @media (max-width: 47.999rem) {
    .opposing-gallery {
      min-height: auto;
      padding: 5rem 1rem;
    }

    .gallery-stage {
      position: relative;
      height: auto;
      min-height: 0;
      overflow: visible;
    }

    .gallery-stage::after,
    .gallery-progress {
      display: none;
    }

    .gallery-intro {
      position: relative;
      top: auto;
      left: auto;
      width: 100%;
      max-width: 32rem;
      text-align: left;
      transform: none;
    }

    .gallery-heading {
      font-size: clamp(3.35rem, 16vw, 5rem);
    }

    .gallery-instruction {
      margin-right: 0;
      margin-left: 0;
    }

    .gallery-columns {
      position: relative;
      display: grid;
      gap: 1rem;
      margin-top: 3.5rem;
      padding: 0;
    }

    .gallery-rail {
      gap: 2.5rem;
      padding: 0;
      transform: none !important;
      will-change: auto;
    }

    .gallery-card,
    .gallery-card-offset {
      width: 100%;
    }

    .gallery-card-title {
      font-size: 1.25rem;
    }

    .lightbox-frame {
      height: min(92dvh, 54rem);
    }

    .lightbox-figure {
      grid-template-columns: 1fr;
      grid-template-rows: minmax(0, 1fr) auto;
    }

    .lightbox-caption {
      padding: 0.5rem 0.25rem 0.2rem;
    }
  }

  @media (max-width: 35rem) {
    .gallery-columns {
      grid-template-columns: 1fr;
    }

    .gallery-rail-down {
      margin-top: 1.5rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .gallery-rail {
      transform: none !important;
      will-change: auto;
    }

    .gallery-card,
    .gallery-image-frame,
    .gallery-image-frame img,
    .gallery-expand,
    .gallery-lightbox {
      animation: none;
      transition: none;
    }
  }
</style>
