<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowUpRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";

  interface Props {
    cta: {
      heading: string;
      description: string;
      primaryLabel: string;
      primaryHref: string;
      secondaryLabel: string;
      secondaryHref: string;
    };
  }

  let { cta }: Props = $props();

  let section: HTMLElement;

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          const titleWords = section.querySelectorAll(".cta-title-word");
          gsap.from(titleWords, {
            yPercent: 115,
            rotation: 2.5,
            duration: 1.15,
            stagger: 0.09,
            ease: "power4.out",
            scrollTrigger: {
              trigger: section,
              start: "top 72%",
              toggleActions: "play none none reverse",
            },
          });

          gsap.from(".cta-detail-anim", {
            autoAlpha: 0,
            y: 28,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
              toggleActions: "play none none reverse",
            },
          });

          gsap.from(".cta-divider-line", {
            scaleX: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
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
  id="portfolio-cta"
  bind:this={section}
  aria-labelledby="portfolio-cta-title"
  class="portfolio-cta-section"
>
  <div class="cta-divider-line" aria-hidden="true"></div>

  <div class="portfolio-cta-content site-shell">
    <div class="portfolio-cta-grid">
      <div class="portfolio-cta-heading-area">
        <p class="cta-detail-anim eyebrow text-brand-green">Get started</p>

        <h2 id="portfolio-cta-title" class="portfolio-cta-title">
          {#each cta.heading.split(" ") as word, index (`cta-word-${index}`)}
            <span class="cta-title-mask"
              ><span class="cta-title-word">{word}</span></span
            >
          {/each}
        </h2>
      </div>

      <div class="portfolio-cta-details">
        <p class="cta-detail-anim portfolio-cta-description">
          {cta.description}
        </p>

        <div class="cta-detail-anim portfolio-cta-actions">
          <a
            href={resolve(cta.primaryHref)}
            class="portfolio-cta-primary group"
          >
            <span>{cta.primaryLabel}</span>
            <ArrowUpRight
              size={17}
              strokeWidth={1.7}
              class="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>
          <a
            href={resolve(cta.secondaryHref)}
            class="portfolio-cta-secondary group"
          >
            <span>{cta.secondaryLabel}</span>
            <ArrowUpRight
              size={15}
              strokeWidth={1.7}
              class="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </div>

    <footer class="portfolio-cta-footer">
      <span>Studio Click House</span>
      <span>Dhaka, Bangladesh</span>
    </footer>
  </div>
</section>

<style>
  .portfolio-cta-section {
    position: relative;
    background: var(--color-brand-dark);
    color: var(--color-brand-light);
    overflow: clip;
  }

  .cta-divider-line {
    height: 1px;
    background: color-mix(in srgb, var(--color-brand-light) 14%, transparent);
    transform-origin: left center;
    will-change: transform;
  }

  .portfolio-cta-content {
    padding-block: clamp(5rem, 10vw, 10rem) clamp(3rem, 5vw, 5rem);
  }

  .portfolio-cta-grid {
    display: grid;
    gap: clamp(2rem, 4vw, 4rem);
  }

  .portfolio-cta-title {
    margin-top: 1.5rem;
    font-family: var(--font-display);
    font-size: clamp(2.8rem, 6vw, 6.5rem);
    line-height: 0.9;
    letter-spacing: -0.045em;
    font-weight: 400;
    max-width: 16ch;
  }

  .cta-title-mask {
    display: inline-block;
    overflow: hidden;
    margin-right: 0.2em;
    padding-bottom: 0.08em;
    vertical-align: bottom;
  }

  .cta-title-word {
    display: block;
    transform-origin: left bottom;
    will-change: transform;
  }

  .portfolio-cta-description {
    max-width: 30rem;
    font-size: clamp(0.88rem, 1.05vw, 1.05rem);
    line-height: 1.6;
    color: color-mix(in srgb, var(--color-brand-light) 68%, transparent);
  }

  .portfolio-cta-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.5rem;
    margin-top: clamp(2rem, 3.5vw, 3rem);
  }

  .portfolio-cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.75rem;
    background: var(--color-brand-green);
    color: var(--color-brand-light);
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border-radius: 0.2rem;
    transition:
      background 280ms ease,
      color 280ms ease,
      transform 200ms ease;
  }

  .portfolio-cta-primary:hover {
    background: var(--color-brand-light);
    color: var(--color-brand-dark);
  }

  .portfolio-cta-primary:active {
    transform: scale(0.98);
  }

  .portfolio-cta-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding-bottom: 0.35rem;
    border-bottom: 1px solid currentColor;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--color-brand-light);
    transition:
      color 250ms ease,
      gap 250ms ease;
  }

  .portfolio-cta-secondary:hover {
    color: var(--color-brand-green);
    gap: 0.85rem;
  }

  .portfolio-cta-footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;
    margin-top: clamp(5rem, 8vw, 8rem);
    padding-top: 1.25rem;
    border-top: 1px solid
      color-mix(in srgb, var(--color-brand-light) 12%, transparent);
    font-family: var(--font-mono);
    font-size: 0.52rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: color-mix(in srgb, var(--color-brand-light) 35%, transparent);
  }

  @media (min-width: 1024px) {
    .portfolio-cta-grid {
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
      align-items: end;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cta-title-word {
      transform: none !important;
    }

    .cta-divider-line {
      will-change: auto;
    }
  }
</style>
