<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { clientLocations } from "$lib/content/home";
  import type { AboutPageData } from "$lib/types/about";
  import ThreeGlobe from "./ThreeGlobe.svelte";

  let { closingCta } = $props<{
    closingCta: AboutPageData["closingCta"];
  }>();

  let sectionRoot: HTMLElement;
  let globeStage: HTMLDivElement;

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !sectionRoot || !globeStage) return;

      const { gsap } = runtime;
      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add(
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          () => {
            const reveal = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: sectionRoot,
                start: "top 90%",
                end: "top 24%",
                scrub: 0.35,
              },
            });

            reveal
              .from(
                ".network-copy-step",
                {
                  autoAlpha: 0,
                  x: -46,
                  y: 20,
                  stagger: 0.07,
                  duration: 0.62,
                },
                0,
              )
              .from(
                globeStage,
                {
                  autoAlpha: 0.25,
                  x: 72,
                  scale: 0.9,
                  duration: 0.86,
                },
                0.08,
              )
              .from(
                ".globe-ambient",
                {
                  autoAlpha: 0,
                  scale: 0.55,
                  duration: 0.9,
                },
                0.12,
              );
          },
        );

        return () => media.revert();
      }, sectionRoot);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="global-production-network"
  aria-labelledby="global-production-heading"
  bind:this={sectionRoot}
  data-cursor-trail="off"
  class="network-section relative min-h-[100dvh] overflow-hidden bg-brand-dark px-4 text-brand-light lg:py-0"
>
  <div class="site-shell relative z-10 mx-auto max-w-7xl lg:min-h-[100dvh]">
    <div
      class="grid items-center gap-5 lg:min-h-[100dvh] lg:grid-cols-12 lg:gap-6"
    >
      <div class="z-20 flex flex-col lg:col-span-4 lg:py-6">
        <h2
          id="global-production-heading"
          class="network-copy-step max-w-xl font-display text-[clamp(3rem,5.5vw,5rem)] font-light leading-[0.98] tracking-[-0.035em]"
        >
          {closingCta.heading}
        </h2>

        <p
          class="network-copy-step mt-4 max-w-md text-sm leading-6 text-brand-light/62"
        >
          {closingCta.description}
        </p>

        <a
          href={closingCta.primaryCtaHref}
          class="network-copy-step mt-8 inline-flex min-h-12 w-fit items-center justify-center gap-3 rounded-[0.55rem] bg-brand-green px-7 text-sm font-semibold text-brand-dark transition-colors duration-300 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
        >
          <span>{closingCta.primaryCtaLabel}</span>
          <ArrowRight class="h-5 w-5" />
        </a>
      </div>

      <div
        bind:this={globeStage}
        class="globe-stage relative flex min-h-[36rem] items-center justify-center lg:col-span-8 lg:min-h-0 lg:translate-x-12 xl:translate-x-20"
      >
        <div class="globe-ambient" aria-hidden="true"></div>
        <ThreeGlobe locations={clientLocations} />
      </div>
    </div>
  </div>
</section>

<style>
  .network-section::before {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        circle at 76% 42%,
        color-mix(in srgb, var(--color-brand-green) 24%, transparent) 0,
        color-mix(in srgb, var(--color-brand-green) 9%, transparent) 34%,
        transparent 62%
      ),
      radial-gradient(
        ellipse at 18% 54%,
        color-mix(in srgb, var(--color-brand-green) 6%, transparent) 0,
        transparent 48%
      ),
      radial-gradient(
        circle at 76% 42%,
        rgb(51 46 45 / 0.42) 0,
        rgb(51 46 45 / 0.18) 34%,
        transparent 68%
      );
    pointer-events: none;
    content: "";
  }

  .network-section::after {
    content: none;
  }

  .globe-stage {
    isolation: isolate;
    will-change: transform, opacity;
  }

  .globe-ambient {
    position: absolute;
    z-index: -1;
    width: min(98%, 50rem);
    aspect-ratio: 1;
    border-radius: 9999px;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--color-brand-green) 38%, transparent) 0,
      color-mix(in srgb, var(--color-brand-green) 16%, transparent) 38%,
      transparent 70%
    );
    filter: blur(1.1rem);
    opacity: 0.9;
    pointer-events: none;
    will-change: transform, opacity;
  }

  .network-section {
    padding-block: clamp(4rem, 7vw, 7rem);
  }

  @media (min-width: 1024px) {
    .network-section {
      padding-block: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .globe-stage,
    .globe-ambient {
      will-change: auto;
    }
  }
</style>
