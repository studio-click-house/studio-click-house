<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowUpRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { PortfolioFeaturedProject } from "$lib/types/portfolio";

  interface Props {
    projects: PortfolioFeaturedProject[];
  }

  let { projects }: Props = $props();

  let section: HTMLElement;
  let cascadeCards: HTMLElement[] = [];

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
      const { gsap, ScrollTrigger } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          // Staggered reveal of the section title
          const headerWords = section.querySelectorAll(".cascade-header-word");
          gsap.from(headerWords, {
            yPercent: 110,
            rotation: 2.5,
            duration: 1.2,
            stagger: 0.08,
            ease: "power4.out",
            scrollTrigger: {
              trigger: section.querySelector(".cascade-header"),
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          });

          // Cascade card scroll animations
          cascadeCards.forEach((card, index) => {
            if (!card) return;

            const bezel = card.querySelector<HTMLElement>(".double-bezel");
            const img = card.querySelector<HTMLElement>(".cascade-img");
            const copy = card.querySelector<HTMLElement>(".cascade-copy-wrap");
            const tags = card.querySelectorAll(".cascade-tag-anim");

            if (!bezel || !img || !copy) return;

            const rotationDirection = index % 2 === 0 ? 1 : -1;
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                end: "bottom 30%",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            });

            timeline
              // Gentle rotation tilt of the double-bezel plate on scroll
              .fromTo(
                bezel,
                {
                  y: 40,
                  rotation: 2.2 * rotationDirection,
                  scale: 0.96,
                },
                {
                  y: -30,
                  rotation: -1 * rotationDirection,
                  scale: 1,
                  duration: 1,
                  ease: "none",
                },
                0,
              )
              // Parallax movement of the image inside its crop
              .fromTo(
                img,
                { yPercent: -4, scale: 1.1 },
                { yPercent: 4, scale: 1.02, duration: 1, ease: "none" },
                0,
              )
              // Floating text moves independently (asymmetric depth)
              .fromTo(
                copy,
                { y: 60, autoAlpha: 0.4 },
                { y: -10, autoAlpha: 1, duration: 0.7, ease: "none" },
                0.15,
              );

            // Staggered tag animation
            if (tags.length > 0) {
              gsap.from(tags, {
                autoAlpha: 0,
                y: 10,
                stagger: 0.05,
                duration: 0.4,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 70%",
                  toggleActions: "play none none reverse",
                },
              });
            }
          });

          ScrollTrigger.refresh();
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
  id="featured-case-studies"
  bind:this={section}
  aria-labelledby="cascade-studies-title"
  class="cascade-section"
>
  <header class="cascade-header site-shell">
    <div class="cascade-header-rule">
      <p class="eyebrow text-brand-green">Exhibition</p>
      <p class="cascade-header-meta">
        {String(projects.length).padStart(2, "0")} selected commissions
      </p>
    </div>

    <h2 id="cascade-studies-title" class="cascade-heading">
      <span class="cascade-heading-mask"
        ><span class="cascade-header-word">Commissioned</span></span
      >
      <span class="cascade-heading-mask"
        ><span class="cascade-header-word italic text-brand-green"
          >retouching work.</span
        ></span
      >
    </h2>
  </header>

  <div class="cascade-stage site-shell">
    {#each projects as project, index (project.id)}
      <article
        bind:this={cascadeCards[index]}
        class="cascade-card"
        class:cascade-card--right={index % 2 !== 0}
        aria-labelledby="cascade-title-{project.id}"
      >
        <!-- Double-Bezel Nested Enclosure for the visual asset -->
        <div class="double-bezel">
          <div class="double-bezel-inner">
            <img
              src={project.media.src}
              alt={project.media.alt}
              width={project.media.width}
              height={project.media.height}
              loading="lazy"
              decoding="async"
              class="cascade-img"
            />
            <div class="cascade-img-overlay"></div>
          </div>
        </div>

        <!-- Asymmetric Copy Block floating on Z-axis (Double-Bezel Nesting) -->
        <div class="cascade-copy-wrap double-bezel-copy">
          <div class="double-bezel-copy-inner">
            <div class="cascade-project-meta">
              <span class="cascade-tag-anim font-mono text-[0.62rem] uppercase tracking-widest text-brand-green font-bold">
                {project.category}
              </span>
              <span class="cascade-tag-anim font-mono text-[0.62rem] text-brand-dark/40 font-semibold">
                · {project.year}
              </span>
            </div>

            <h3
              id="cascade-title-{project.id}"
              class="cascade-project-title"
            >
              {project.title}
            </h3>

            <p class="cascade-project-subtitle">
              {project.subtitle}
            </p>

            <p class="cascade-project-description">
              {project.description}
            </p>

            <div class="cascade-tags">
              {#each project.tags as tag (tag)}
                <span class="cascade-tag cascade-tag-anim">{tag}</span>
              {/each}
            </div>

            <!-- Tactical 'Button-in-Button' pill CTA -->
            <div class="cascade-cta-row">
              <a
                href={project.href}
                class="cascade-btn group"
              >
                <span class="cascade-btn-text">View Case Study</span>
                <span class="cascade-btn-icon-wrap" aria-hidden="true">
                  <ArrowUpRight
                    size={13}
                    strokeWidth={2}
                  />
                </span>
              </a>
            </div>
          </div>
        </div>
      </article>
    {/each}
  </div>
</section>

<style>
  .cascade-section {
    position: relative;
    background: var(--color-brand-paper);
    color: var(--color-brand-dark);
    overflow: clip;
    padding-bottom: clamp(6rem, 10vw, 10rem);
  }

  .cascade-header {
    padding-block: clamp(6rem, 10vw, 10rem) clamp(3rem, 6vw, 6rem);
  }

  .cascade-header-rule {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border-block: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 12%, transparent);
    padding-block: 1.1rem;
  }

  .cascade-header-meta {
    font-family: var(--font-mono);
    font-size: 0.55rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: color-mix(in srgb, var(--color-brand-dark) 45%, transparent);
  }

  .cascade-heading {
    margin-top: clamp(2rem, 4vw, 4rem);
    font-family: var(--font-display);
    font-size: clamp(3.5rem, 8vw, 8.5rem);
    line-height: 0.9;
    letter-spacing: -0.045em;
    font-weight: 400;
  }

  .cascade-heading-mask {
    display: block;
    overflow: hidden;
    padding-bottom: 0.08em;
  }

  .cascade-heading-mask > span {
    display: block;
    transform-origin: left bottom;
    will-change: transform;
  }

  .cascade-stage {
    display: grid;
    gap: clamp(8rem, 15vw, 16rem);
  }

  .cascade-card {
    position: relative;
    display: grid;
    gap: 2.5rem;
    grid-template-columns: 1fr;
    max-width: 38rem;
    margin-inline: auto;
  }

  /* Double-Bezel Enclosure */
  .double-bezel {
    position: relative;
    background: color-mix(in srgb, var(--color-brand-dark) 4%, transparent);
    border: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 8%, transparent);
    padding: clamp(0.75rem, 2vw, 1.25rem);
    border-radius: 2.5rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.015);
    aspect-ratio: 3 / 4;
    width: 100%;
    will-change: transform;
  }

  .double-bezel-inner {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: calc(2.5rem - clamp(0.75rem, 2vw, 1.25rem));
    border: 1px solid
      color-mix(in srgb, var(--color-brand-light) 40%, transparent);
    box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.2);
  }

  .cascade-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 15%;
    transform-origin: center center;
    will-change: transform;
  }

  .cascade-img-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      180deg,
      transparent 70%,
      rgba(32, 33, 31, 0.15) 100%
    );
  }

  /* Asymmetric Copy Block floating on Z-axis */
  .cascade-copy-wrap {
    position: relative;
    z-index: 10;
    align-self: center;
    will-change: transform, opacity;
  }

  .double-bezel-copy {
    background: color-mix(in srgb, var(--color-brand-dark) 4%, transparent);
    border: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 8%, transparent);
    padding: clamp(0.5rem, 1.2vw, 0.85rem);
    border-radius: 2.5rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.015);
    width: 100%;
  }

  .double-bezel-copy-inner {
    position: relative;
    background: var(--color-brand-light);
    border-radius: calc(2.5rem - clamp(0.5rem, 1.2vw, 0.85rem));
    border: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 8%, transparent);
    box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.4);
    padding: clamp(1.5rem, 4vw, 2.5rem);
  }

  .cascade-project-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .cascade-project-title {
    margin-top: 1rem;
    font-family: var(--font-display);
    font-size: clamp(2rem, 3.8vw, 3.2rem);
    line-height: 0.95;
    letter-spacing: -0.04em;
    color: var(--color-brand-dark);
  }

  .cascade-project-subtitle {
    margin-top: 0.5rem;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--color-brand-dark) 50%, transparent);
  }

  .cascade-project-description {
    margin-top: 1.25rem;
    font-size: 0.88rem;
    line-height: 1.6;
    color: color-mix(in srgb, var(--color-brand-dark) 72%, transparent);
  }

  .cascade-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1.5rem;
  }

  .cascade-tag {
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 10%, transparent);
    font-family: var(--font-mono);
    font-size: 0.52rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: color-mix(in srgb, var(--color-brand-dark) 60%, transparent);
    background: transparent;
  }

  .cascade-cta-row {
    margin-top: clamp(2rem, 3.5vh, 2.5rem);
  }

  /* Tactical 'Button-in-Button' pill CTA */
  .cascade-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.6rem 0.6rem 0.6rem 1.4rem;
    background: var(--color-brand-dark);
    color: var(--color-brand-light);
    border-radius: 999px;
    font-family: var(--font-mono);
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    transition:
      background-color 300ms cubic-bezier(0.32, 0.72, 0, 1),
      color 300ms cubic-bezier(0.32, 0.72, 0, 1),
      transform 200ms ease;
  }

  .cascade-btn:hover {
    background-color: var(--color-brand-green);
    color: var(--color-brand-light);
  }

  .cascade-btn:active {
    transform: scale(0.97);
  }

  .cascade-btn-icon-wrap {
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    background: color-mix(in srgb, var(--color-brand-light) 12%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      transform 300ms cubic-bezier(0.32, 0.72, 0, 1),
      background-color 300ms cubic-bezier(0.32, 0.72, 0, 1);
  }

  .cascade-btn:hover .cascade-btn-icon-wrap {
    background-color: var(--color-brand-dark);
    transform: scale(1.03);
  }

  :global(.cascade-btn svg) {
    transition: transform 300ms cubic-bezier(0.32, 0.72, 0, 1);
  }

  :global(.cascade-btn:hover svg) {
    transform: translate(1px, -1px) scale(1.05);
  }

  @media (min-width: 1024px) {
    .cascade-card {
      grid-template-columns: repeat(12, minmax(0, 1fr));
      max-width: none;
      width: 100%;
      align-items: stretch;
      gap: 0;
    }

    .double-bezel {
      grid-column: 1 / span 7;
      grid-row: 1;
      aspect-ratio: auto;
      height: clamp(38rem, 50vh, 46rem);
    }

    .cascade-copy-wrap {
      grid-column: 7 / -1;
      grid-row: 1;
      margin-left: -5.5rem;
      width: 110%;
      max-width: 32rem;
      align-self: center;
    }

    /* Reverse layout for odd index cards */
    .cascade-card--right .double-bezel {
      grid-column: 6 / -1;
      grid-row: 1;
    }

    .cascade-card--right .cascade-copy-wrap {
      grid-column: 1 / span 6;
      grid-row: 1;
      margin-left: 0;
      margin-right: -5.5rem;
      width: 110%;
      justify-self: end;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .double-bezel,
    .cascade-img,
    .cascade-copy-wrap,
    .cascade-btn-icon-wrap,
    :global(.cascade-btn svg),
    .cascade-heading-mask > span {
      transform: none !important;
      opacity: 1 !important;
      will-change: auto;
    }
  }
</style>
