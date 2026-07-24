<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { PortfolioBeforeAfter } from "$lib/types/portfolio";

  interface Props {
    comparison: PortfolioBeforeAfter;
  }

  let { comparison }: Props = $props();

  let section: HTMLElement;
  let afterLayer: HTMLElement;
  let dividerLine: HTMLElement;
  let revealProgress = $state(0);

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
      const { gsap, ScrollTrigger } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          const headerWords = section.querySelectorAll(".compare-header-word");
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

          gsap.to(
            {},
            {
              scrollTrigger: {
                trigger: ".compare-stage",
                start: "top 55%",
                end: "bottom 45%",
                scrub: 0.4,
                onUpdate: (self) => {
                  revealProgress = self.progress;
                  const clipPercent = 100 - self.progress * 100;
                  if (afterLayer) {
                    afterLayer.style.clipPath = `inset(0 ${clipPercent}% 0 0)`;
                  }
                  if (dividerLine) {
                    dividerLine.style.left = `${self.progress * 100}%`;
                  }
                },
              },
            },
          );

          gsap.from(".compare-meta-anim", {
            autoAlpha: 0,
            y: 20,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".compare-stage",
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
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
  id="portfolio-before-after"
  bind:this={section}
  aria-labelledby="compare-title"
  class="compare-section"
>
  <header class="compare-header site-shell">
    <div class="compare-header-rule">
      <p class="eyebrow text-brand-green">Process</p>
      <p class="compare-header-meta">Before ↔ After</p>
    </div>

    <h2 id="compare-title" class="compare-heading">
      <span class="compare-heading-mask"
        ><span class="compare-header-word">{comparison.title.split(" ").slice(0, 3).join(" ")}</span
        ></span
      >
      <span class="compare-heading-mask"
        ><span class="compare-header-word italic text-brand-green"
          >{comparison.title.split(" ").slice(3).join(" ")}</span
        ></span
      >
    </h2>
  </header>

  <div class="compare-stage site-shell">
    <div class="compare-frame">
      <img
        src={comparison.before.src}
        alt={comparison.before.alt}
        width={comparison.before.width}
        height={comparison.before.height}
        loading="lazy"
        decoding="async"
        class="compare-image compare-image-before"
      />

      <div bind:this={afterLayer} class="compare-after-layer">
        <img
          src={comparison.after.src}
          alt={comparison.after.alt}
          width={comparison.after.width}
          height={comparison.after.height}
          loading="lazy"
          decoding="async"
          class="compare-image compare-image-after"
        />
      </div>

      <div bind:this={dividerLine} class="compare-divider" aria-hidden="true">
        <div class="compare-divider-knob">
          <span class="compare-divider-arrow">◂</span>
          <span class="compare-divider-arrow">▸</span>
        </div>
      </div>

      <div class="compare-label compare-label-before">
        <span class="compare-label-dot" aria-hidden="true"></span>
        {comparison.beforeLabel}
      </div>

      <div class="compare-label compare-label-after">
        {comparison.afterLabel}
        <span class="compare-label-dot compare-label-dot--green" aria-hidden="true"></span>
      </div>
    </div>

    <div class="compare-meta">
      <p class="compare-meta-anim compare-description">
        {comparison.description}
      </p>
      <div class="compare-meta-anim compare-progress-bar">
        <div
          class="compare-progress-fill"
          style:width="{revealProgress * 100}%"
        ></div>
      </div>
      <div class="compare-meta-anim compare-progress-labels">
        <span>{comparison.beforeLabel}</span>
        <span>{comparison.afterLabel}</span>
      </div>
    </div>
  </div>
</section>

<style>
  .compare-section {
    position: relative;
    background: var(--color-brand-dark);
    color: var(--color-brand-light);
    overflow: clip;
  }

  .compare-header {
    padding-block: clamp(3rem, 5vw, 5rem) clamp(1.5rem, 3vw, 3rem);
  }

  .compare-header-rule {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border-block: 1px solid
      color-mix(in srgb, var(--color-brand-light) 14%, transparent);
    padding-block: 1.1rem;
  }

  .compare-header-meta {
    font-family: var(--font-mono);
    font-size: 0.55rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: color-mix(in srgb, var(--color-brand-light) 45%, transparent);
  }

  .compare-heading {
    margin-top: clamp(2rem, 4vw, 4rem);
    font-family: var(--font-display);
    font-size: clamp(3.2rem, 7vw, 8rem);
    line-height: 0.88;
    letter-spacing: -0.05em;
    font-weight: 400;
  }

  .compare-heading-mask {
    display: block;
    overflow: hidden;
    padding-bottom: 0.1em;
  }

  .compare-heading-mask > span {
    display: block;
    transform-origin: left bottom;
    will-change: transform;
  }

  .compare-stage {
    padding-bottom: clamp(3rem, 5vw, 5rem);
  }

  .compare-frame {
    position: relative;
    width: 100%;
    max-width: 56rem;
    margin-inline: auto;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-light) 12%, transparent);
    background: var(--color-brand-dark);
  }

  .compare-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .compare-after-layer {
    position: absolute;
    inset: 0;
    clip-path: inset(0 100% 0 0);
    will-change: clip-path;
  }

  .compare-divider {
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 100%;
    background: var(--color-brand-green);
    z-index: 3;
    will-change: left;
    pointer-events: none;
  }

  .compare-divider-knob {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: var(--color-brand-green);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.35);
  }

  .compare-divider-arrow {
    font-size: 0.6rem;
    color: var(--color-brand-light);
    line-height: 1;
  }

  .compare-label {
    position: absolute;
    bottom: 1.25rem;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-mono);
    font-size: 0.55rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: color-mix(in srgb, var(--color-brand-light) 80%, transparent);
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
  }

  .compare-label-before {
    left: 1.25rem;
  }

  .compare-label-after {
    right: 1.25rem;
  }

  .compare-label-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--color-brand-light) 50%, transparent);
  }

  .compare-label-dot--green {
    background: var(--color-brand-green);
  }

  .compare-meta {
    max-width: 56rem;
    margin-inline: auto;
    margin-top: 2rem;
  }

  .compare-description {
    max-width: 34rem;
    font-size: clamp(0.85rem, 1vw, 0.95rem);
    line-height: 1.65;
    color: color-mix(in srgb, var(--color-brand-light) 68%, transparent);
  }

  .compare-progress-bar {
    margin-top: 1.5rem;
    width: 100%;
    height: 2px;
    background: color-mix(in srgb, var(--color-brand-light) 12%, transparent);
    overflow: hidden;
  }

  .compare-progress-fill {
    height: 100%;
    background: var(--color-brand-green);
    transition: width 80ms linear;
  }

  .compare-progress-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 0.6rem;
    font-family: var(--font-mono);
    font-size: 0.5rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: color-mix(in srgb, var(--color-brand-light) 40%, transparent);
  }

  @media (prefers-reduced-motion: reduce) {
    .compare-after-layer {
      clip-path: inset(0 50% 0 0) !important;
      will-change: auto;
    }

    .compare-divider {
      left: 50% !important;
      will-change: auto;
    }

    .compare-heading-mask > span {
      transform: none !important;
    }
  }
</style>
