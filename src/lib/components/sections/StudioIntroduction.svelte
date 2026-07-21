<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { studioDressColorways } from "$lib/content/media";

  let section: HTMLElement;
  let comparisonFrame: HTMLElement;
  let aboutCopy: HTMLElement;
  let colorwaysReady = $state(false);
  let selectedColorwayId =
    $state<(typeof studioDressColorways)[number]["id"]>("emerald");

  function selectColorway(
    colorwayId: (typeof studioDressColorways)[number]["id"],
  ) {
    if (!colorwaysReady || colorwayId === selectedColorwayId) return;

    selectedColorwayId = colorwayId;
  }

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;
    const colorwayPreloads = studioDressColorways.map((colorway) => {
      const preload = new Image();
      preload.decoding = "async";
      preload.src = colorway.src;
      return preload;
    });

    void Promise.allSettled(
      colorwayPreloads.map((preload) => preload.decode()),
    ).then(() => {
      if (active) colorwaysReady = true;
    });

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section || !comparisonFrame || !aboutCopy)
        return;

      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          const revealTimeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top 92%",
              end: "top 26%",
              scrub: 0.8,
            },
          });

          revealTimeline.fromTo(
            comparisonFrame,
            {
              autoAlpha: 0.45,
              y: 54,
              scale: 0.92,
              clipPath: "inset(9% 7% 9% 7% round 2rem)",
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0% round 1.5rem)",
              duration: 0.7,
            },
            0,
          );

          gsap
            .timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 82%",
                end: "center 50%",
                scrub: 1.18,
              },
            })
            .from(
              aboutCopy,
              {
                autoAlpha: 0.2,
                x: 82,
                duration: 0.5,
                ease: "power2.out",
              },
              0,
            )
            .from(
              ".about-title-line > span",
              {
                yPercent: 112,
                rotate: 2,
                transformOrigin: "left bottom",
                duration: 0.58,
                stagger: 0.1,
                ease: "power3.out",
              },
              0.08,
            )
            .from(
              ".about-copy-step",
              {
                autoAlpha: 0,
                x: 42,
                y: 24,
                duration: 0.46,
                stagger: 0.12,
                ease: "power2.out",
              },
              0.52,
            );

          gsap.fromTo(
            ".comparison-media",
            { yPercent: -6, scale: 1.08 },
            {
              yPercent: 6,
              scale: 1.015,
              ease: "none",
              scrollTrigger: {
                trigger: comparisonFrame,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.65,
              },
            },
          );

          gsap.fromTo(
            ".grading-orbit",
            { x: 34, y: -30 },
            {
              x: -20,
              y: 48,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 88%",
                end: "bottom 16%",
                scrub: 0.55,
              },
            },
          );
        });

        media.add(
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          () => {
            gsap.to(".grading-orb-shadow", {
              x: 22,
              y: 18,
              scale: 1.025,
              rotation: 4,
              duration: 4.8,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });

            gsap.to(".grading-orb-midtone", {
              x: -20,
              y: -22,
              scale: 0.97,
              rotation: -3,
              duration: 3.1,
              ease: "power1.inOut",
              repeat: -1,
              yoyo: true,
            });

            gsap.to(".grading-orb-highlight", {
              x: 14,
              y: 24,
              scale: 1.06,
              rotation: 6,
              duration: 1.9,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
          },
        );

        media.add(
          "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
          () => {
            gsap.to(".grading-orb-highlight", {
              x: -10,
              y: 14,
              scale: 1.04,
              duration: 2.3,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
          },
        );

        return () => media.revert();
      }, section);
    });

    return () => {
      active = false;
      context?.revert();
      colorwayPreloads.forEach((preload) => {
        preload.src = "";
      });
    };
  });
</script>

<svelte:head>
  {#each studioDressColorways as colorway}
    <link rel="preload" as="image" href={colorway.src} />
  {/each}
</svelte:head>

<section
  id="studio-introduction"
  bind:this={section}
  aria-labelledby="studio-introduction-title"
  class="about-section relative overflow-hidden bg-brand-paper pt-24 pb-8 text-brand-dark sm:pt-32 sm:pb-12"
>
  <div
    class="absolute inset-x-0 top-0 h-px bg-brand-dark/10"
    aria-hidden="true"
  ></div>

  <div
    class="about-grid site-shell pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2"
    aria-hidden="true"
  ></div>

  <div class="site-shell relative z-10">
    <div class="about-layout">
      <figure class="about-comparison">
        <div
          bind:this={comparisonFrame}
          class="comparison-frame"
          role="group"
          aria-label="Interactive outfit color-correction preview"
        >
          <div class="comparison-media">
            {#each studioDressColorways as colorway}
              <img
                src={colorway.src}
                alt={colorway.id === selectedColorwayId ? colorway.alt : ""}
                width={colorway.width}
                height={colorway.height}
                loading="eager"
                decoding="async"
                aria-hidden={colorway.id !== selectedColorwayId}
                class:colorway-image-active={colorway.id === selectedColorwayId}
                class="colorway-image"
              />
            {/each}
          </div>
        </div>

        <div
          class="colorway-controls"
          role="group"
          aria-label="Choose an outfit color correction"
        >
          {#each studioDressColorways as colorway}
            <button
              type="button"
              class:colorway-control-active={colorway.id === selectedColorwayId}
              class="colorway-control"
              aria-label={`Show ${colorway.label} color correction`}
              aria-pressed={colorway.id === selectedColorwayId}
              disabled={!colorwaysReady}
              onclick={() => selectColorway(colorway.id)}
              onmouseenter={() => selectColorway(colorway.id)}
            >
              <span
                class="colorway-swatch"
                data-colorway={colorway.id}
                aria-hidden="true"
              ></span>
            </button>
          {/each}
        </div>
      </figure>

      <div bind:this={aboutCopy} class="about-copy">
        <div class="grading-orbit" aria-hidden="true">
          <span class="grading-orb grading-orb-shadow"></span>
          <span class="grading-orb grading-orb-midtone"></span>
          <span class="grading-orb grading-orb-highlight"></span>
        </div>

        <h2
          id="studio-introduction-title"
          class="font-display text-[clamp(2.65rem,4.8vw,5.4rem)] leading-[0.88] tracking-[-0.045em]"
        >
          <span class="about-title-line">
            <span>Image editing,</span>
          </span>
          <span class="about-title-line">
            <span><em class="text-brand-green">built for scale.</em></span>
          </span>
        </h2>

        <p
          class="about-copy-step mt-8 max-w-md text-sm leading-relaxed text-brand-dark/70 sm:text-base"
        >
          Studio Click House is a Bangladesh-based image post-production studio
          serving photographers, creative agencies, online shops, and retailers
          worldwide. Since 2022, we have delivered image editing and retouching
          for consistent, production-ready visual content.
        </p>

        <p
          class="about-copy-step mt-5 max-w-md border-l border-brand-green/45 pl-5 text-sm italic leading-relaxed text-brand-dark/60 sm:text-base"
        >
          Our team of 150+ designers brings 4–16 years of individual experience
          and works 24/7 to support demanding image volumes and deadlines.
        </p>

        <div class="about-copy-step about-actions">
          <a href={resolve("/about")} class="about-action about-action-primary">
            <span>About the studio</span>
            <ArrowUpRight size={15} strokeWidth={1.7} />
          </a>

          <a
            href={resolve("/contact")}
            class="about-action about-action-secondary"
          >
            <span>Free trial</span>
            <ArrowUpRight size={15} strokeWidth={1.7} />
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .about-grid {
    background-image: linear-gradient(
      to right,
      color-mix(in srgb, var(--color-brand-dark) 7%, transparent) 1px,
      transparent 1px
    );
    background-position: center top;
    background-size: clamp(7rem, 8vw, 10rem) 100%;
  }

  .about-layout {
    display: grid;
    align-items: center;
    gap: 4.5rem;
  }

  .about-comparison {
    position: relative;
    width: min(calc(100% - 4rem), 44rem);
    margin: 0 auto;
  }

  .comparison-frame {
    position: relative;
    aspect-ratio: 4 / 5;
    overflow: hidden;
    border-radius: 1.5rem;
    background: var(--color-brand-dark);
    box-shadow: 0 2rem 5rem
      color-mix(in srgb, var(--color-brand-dark) 16%, transparent);
    touch-action: pan-y;
    will-change: clip-path, transform;
  }

  .comparison-media {
    position: absolute;
    inset: -2.5% 0;
    overflow: hidden;
    will-change: transform;
  }

  .colorway-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 24%;
    opacity: 0;
    user-select: none;
    pointer-events: none;
  }

  .colorway-image-active {
    z-index: 1;
    opacity: 1;
  }

  .colorway-controls {
    --colorway-emerald: oklch(38% 0.1 165deg);
    --colorway-cobalt: oklch(42% 0.18 265deg);
    --colorway-plum: oklch(34% 0.11 330deg);
    position: absolute;
    z-index: 7;
    top: 50%;
    right: -4rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    transform: translateY(-50%);
  }

  .colorway-control {
    display: grid;
    width: 2.75rem;
    height: 2.75rem;
    place-items: center;
    padding: 0;
    border: 0;
    border-radius: 9999px;
    background: transparent;
    box-shadow: none;
    cursor: pointer;
  }

  .colorway-control:focus-visible {
    outline: 2px solid var(--color-brand-green);
    outline-offset: 1px;
  }

  .colorway-control-active {
    background: transparent;
    box-shadow: none;
  }

  .colorway-swatch {
    width: 1.2rem;
    height: 1.2rem;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-light) 42%, transparent);
    border-radius: 9999px;
  }

  .colorway-control-active .colorway-swatch {
    box-shadow:
      0 0 0 2px var(--color-brand-paper),
      0 0 0 4px var(--color-brand-green);
  }

  .colorway-swatch[data-colorway="emerald"] {
    background: var(--colorway-emerald);
  }

  .colorway-swatch[data-colorway="cobalt"] {
    background: var(--colorway-cobalt);
  }

  .colorway-swatch[data-colorway="plum"] {
    background: var(--colorway-plum);
  }

  .about-title-line {
    display: block;
    overflow: hidden;
    padding: 0 0.1em 0.24em;
    margin: 0 -0.1em -0.24em;
  }

  .about-title-line > span {
    display: block;
    will-change: transform;
  }

  .about-copy {
    position: relative;
    isolation: isolate;
  }

  .about-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 2rem;
  }

  .about-action {
    display: inline-flex;
    min-height: 3rem;
    min-width: 10.5rem;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-inline: 1rem;
    border: 1px solid var(--color-brand-dark);
    border-radius: 0.2rem;
    font-family: var(--font-sans);
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.045em;
    text-transform: uppercase;
    transition:
      color 280ms ease,
      background 280ms ease,
      border-color 280ms ease,
      transform 280ms ease;
  }

  .about-action :global(svg) {
    transition: transform 280ms ease;
  }

  .about-action:hover :global(svg) {
    transform: translate(0.15rem, -0.15rem);
  }

  .about-action:active {
    transform: scale(0.98);
  }

  .about-action:focus-visible {
    outline: 3px solid var(--color-brand-green);
    outline-offset: 3px;
  }

  .about-action-primary {
    background: var(--color-brand-dark);
    color: var(--color-brand-light);
  }

  .about-action-primary:hover {
    border-color: var(--color-brand-green);
    background: var(--color-brand-green);
    color: var(--color-brand-dark);
  }

  .about-action-secondary {
    background: color-mix(in srgb, var(--color-brand-paper) 72%, transparent);
    color: var(--color-brand-dark);
  }

  .about-action-secondary:hover {
    border-color: var(--color-brand-green);
    background: var(--color-brand-green);
  }

  .about-copy > :not(.grading-orbit) {
    position: relative;
    z-index: 1;
  }

  .grading-orbit {
    position: absolute;
    z-index: 0;
    inset: -6rem -5rem -5rem -4rem;
    overflow: visible;
    pointer-events: none;
    will-change: transform;
  }

  .grading-orb {
    position: absolute;
    display: block;
    border-radius: 9999px;
    will-change: transform;
  }

  .grading-orb-shadow {
    top: 2%;
    right: -5%;
    width: 15rem;
    height: 15rem;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 12%, transparent);
    background: color-mix(in srgb, var(--color-brand-dark) 8%, transparent);
  }

  .grading-orb-midtone {
    top: 42%;
    left: 2%;
    width: 10rem;
    height: 10rem;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-green) 20%, transparent);
    background: color-mix(in srgb, var(--color-brand-green) 9%, transparent);
  }

  .grading-orb-highlight {
    top: 74%;
    right: 8%;
    width: 6rem;
    height: 6rem;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-green) 32%, transparent);
    background: color-mix(in srgb, var(--color-brand-green) 16%, transparent);
  }

  @media (min-width: 1024px) {
    .about-layout {
      grid-template-columns: minmax(0, 1.08fr) minmax(22rem, 0.92fr);
      gap: clamp(4rem, 7vw, 8rem);
    }

    .about-comparison {
      width: min(100%, calc(76svh * 4 / 5));
      margin: 0;
    }

    .comparison-frame {
      max-height: 76svh;
    }

    .about-copy {
      max-width: 36rem;
      will-change: transform;
    }
  }

  @media (max-width: 640px) {
    .about-layout {
      gap: 3.75rem;
    }

    .colorway-control {
      width: 2.75rem;
      height: 2.75rem;
    }

    .grading-orbit {
      inset: -2rem -1rem auto auto;
      width: 7rem;
      height: 7rem;
    }

    .grading-orb-shadow,
    .grading-orb-midtone {
      display: none;
    }

    .grading-orb-highlight {
      top: 0;
      right: 0;
      width: 4.5rem;
      height: 4.5rem;
      opacity: 0.7;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .comparison-media,
    .grading-orbit,
    .grading-orb,
    .about-title-line > span {
      will-change: auto;
    }

    .colorway-image {
      will-change: auto;
    }
  }
</style>
