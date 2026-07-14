<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { previewMedia } from "$lib/content/media";

  const principles = [
    [
      "Image integrity",
      "Preserve true texture, material, and light while removing only what distracts.",
    ],
    [
      "Set consistency",
      "Align color, contrast, scale, and finish so every frame belongs to one system.",
    ],
    [
      "Purpose-led retouching",
      "Make every correction serve the subject, the channel, and the final use.",
    ],
    [
      "Brand continuity",
      "Carry one visual language from an individual asset through the full campaign.",
    ],
    [
      "Clear collaboration",
      "Turn references and consolidated feedback into focused production decisions.",
    ],
    [
      "Invisible craft",
      "Refine the smallest details until the work feels resolved, never overworked.",
    ],
  ];

  let sequence: HTMLElement;
  let imageFrame: HTMLElement;
  let ghostWord: HTMLElement;
  let handoff: HTMLElement;
  let principleCards: HTMLElement[] = [];

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;

    registerScrollTrigger().then((runtime) => {
      if (
        !active ||
        !runtime ||
        !sequence ||
        !imageFrame ||
        !ghostWord ||
        !handoff
      )
        return;

      const { gsap } = runtime;
      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add(
          "(min-width: 1024px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)",
          () => {
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: sequence,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.1,
                invalidateOnRefresh: true,
              },
            });

            timeline
              .fromTo(
                imageFrame,
                {
                  scale: 0.84,
                  rotation: -2,
                  xPercent: -5,
                  yPercent: 14,
                },
                {
                  scale: 1.02,
                  rotation: 0.35,
                  xPercent: 3,
                  yPercent: -8,
                  duration: 1,
                  ease: "none",
                },
                0,
              )
              .fromTo(
                ghostWord,
                { xPercent: -20, autoAlpha: 0.08 },
                {
                  xPercent: 20,
                  autoAlpha: 0.12,
                  duration: 1,
                  ease: "none",
                },
                0,
              )
              .fromTo(
                principleCards,
                {
                  xPercent: (index) => (index % 2 === 0 ? -10 : 10),
                  y: 24,
                },
                {
                  xPercent: 0,
                  y: -20,
                  duration: 1,
                  ease: "none",
                },
                0,
              )
              .fromTo(
                handoff,
                { y: 16 },
                {
                  y: -12,
                  duration: 1,
                  ease: "none",
                },
                0,
              );
          },
        );

        return () => media.revert();
      }, sequence);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="creative-direction"
  aria-labelledby="creative-direction-title"
  class="direction-section overflow-hidden bg-brand-dark pt-16 text-brand-light sm:pt-20 lg:pt-24"
>
  <div
    class="direction-intro site-shell grid gap-8 lg:grid-cols-[1fr_0.38fr] lg:items-end"
  >
    <div>
      <p class="eyebrow text-brand-green">Creative direction</p>
      <h2
        id="creative-direction-title"
        class="mt-7 max-w-5xl font-display text-[clamp(3.5rem,6.2vw,6.75rem)] leading-[0.88] tracking-[-0.045em]"
      >
        Consistency is a creative decision.
      </h2>
    </div>
    <p class="max-w-md pb-2 text-sm leading-relaxed text-brand-light/55">
      Every image should feel intentional on its own—and unmistakably part of
      the same visual world.
    </p>
  </div>

  <div bind:this={sequence} class="direction-sequence mt-14 lg:mt-20">
    <div class="direction-sticky relative overflow-hidden">
      <p
        bind:this={ghostWord}
        class="direction-ghost pointer-events-none font-display italic text-brand-light"
        aria-hidden="true"
      >
        Direction
      </p>

      <div class="direction-image-anchor">
        <figure
          bind:this={imageFrame}
          class="direction-image relative size-full overflow-hidden border border-brand-light/20 bg-brand-dark shadow-2xl shadow-black/35 will-change-transform"
        >
          <img
            src={previewMedia.jewelryDetail.src}
            alt={previewMedia.jewelryDetail.alt}
            width={previewMedia.jewelryDetail.width}
            height={previewMedia.jewelryDetail.height}
            loading="lazy"
            class="size-full object-cover"
          />
          <div
            class="direction-image-shade absolute inset-0"
            aria-hidden="true"
          ></div>
          <figcaption
            class="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-brand-light/15 bg-brand-dark/70 px-4 py-3 font-mono text-[0.52rem] uppercase tracking-[0.13em] text-brand-light/55 backdrop-blur-sm"
          >
            <span>Material and light study</span><span>Creative direction</span>
          </figcaption>
        </figure>
      </div>

      <div class="direction-principles site-shell">
        {#each principles as principle, index (principle[0])}
          <article
            bind:this={principleCards[index]}
            class="principle-card border-t border-brand-light/20 py-5 will-change-transform"
          >
            <p
              class="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-brand-green"
            >
              Direction detail
            </p>
            <h3 class="mt-4 font-display text-2xl sm:text-3xl">
              {principle[0]}
            </h3>
            <p
              class="mt-3 text-xs leading-relaxed text-brand-light/55 sm:text-sm"
            >
              {principle[1]}
            </p>
          </article>
        {/each}
      </div>

      <div
        bind:this={handoff}
        class="direction-handoff site-shell flex items-center justify-between gap-6 border-t border-brand-light/15 py-5 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-brand-light/45"
      >
        <span>Direction established</span>
        <span class="text-brand-green">See it resolved in the work ↓</span>
      </div>
    </div>
  </div>
</section>

<style>
  .direction-sequence {
    padding-bottom: 2rem;
  }

  .direction-intro {
    position: relative;
    z-index: 3;
  }

  .direction-sticky {
    min-height: 100svh;
  }

  .direction-ghost {
    display: none;
  }

  .direction-image-anchor {
    width: min(calc(100% - 2rem), 36rem);
    height: min(68svh, 46rem);
    margin-inline: auto;
  }

  .direction-image-shade {
    background: linear-gradient(
      to top,
      color-mix(in srgb, var(--color-brand-dark) 55%, transparent),
      transparent 48%
    );
  }

  .direction-principles {
    display: grid;
    gap: 0;
    margin-top: 2rem;
  }

  .direction-handoff {
    margin-top: 2rem;
  }

  @media (min-width: 640px) {
    .direction-principles {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 2rem;
    }
  }

  @media (min-width: 1024px) and (min-height: 650px) and (prefers-reduced-motion: no-preference) {
    .direction-sequence,
    .direction-sticky {
      height: 100svh;
      min-height: 650px;
    }

    .direction-sequence {
      margin-top: clamp(-2rem, -1.5vw, -1rem);
      padding-bottom: 0;
    }

    .direction-ghost {
      position: absolute;
      left: -0.04em;
      top: 6%;
      display: block;
      font-size: clamp(8rem, 18vw, 19rem);
      line-height: 0.76;
      letter-spacing: -0.055em;
      white-space: nowrap;
      will-change: transform, opacity;
    }

    .direction-image-anchor {
      position: absolute;
      left: 50%;
      top: 46%;
      z-index: 1;
      width: min(35vw, 35rem);
      height: min(70svh, 47rem);
      margin: 0;
      transform: translate(-50%, -50%);
    }

    .direction-image {
      transform-origin: center;
    }

    .direction-principles {
      position: absolute;
      inset: 0;
      display: block;
      margin-top: 0;
      pointer-events: none;
    }

    .principle-card {
      position: absolute;
      z-index: 2;
      width: min(23vw, 21rem);
    }

    .principle-card:nth-child(1) {
      left: 0;
      top: 12%;
    }

    .principle-card:nth-child(2) {
      right: 0;
      top: 12%;
    }

    .principle-card:nth-child(3) {
      left: 0;
      top: 43%;
    }

    .principle-card:nth-child(4) {
      right: 0;
      top: 43%;
    }

    .principle-card:nth-child(5) {
      left: 0;
      top: 74%;
    }

    .principle-card:nth-child(6) {
      right: 0;
      top: 74%;
    }

    .direction-handoff {
      position: absolute;
      bottom: 0;
      left: 50%;
      z-index: 4;
      margin-top: 0;
      transform: translateX(-50%);
      will-change: transform, opacity;
    }
  }
</style>
