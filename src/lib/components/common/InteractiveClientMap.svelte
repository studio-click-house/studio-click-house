<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { clientLocations } from "$lib/content/home";
  import type { AboutPageData } from "$lib/types/about";
  import { _ } from "svelte-i18n";
  import { resolve } from "$app/paths";

  type ThreeGlobeComponent = typeof import("./ThreeGlobe.svelte").default;

  let { closingCta } = $props<{
    closingCta: AboutPageData["closingCta"];
  }>();

  let sectionRoot: HTMLElement;
  let globeStage: HTMLDivElement;
  let ThreeGlobe = $state<ThreeGlobeComponent | null>(null);

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;
    let globeObserver: IntersectionObserver | undefined;
    let globeFallbackTimer: number | undefined;

    const loadGlobe = () => {
      void import("./ThreeGlobe.svelte").then(({ default: component }) => {
        if (active) ThreeGlobe = component;
      });
    };

    if ("IntersectionObserver" in window) {
      globeObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          loadGlobe();
          globeObserver?.disconnect();
        },
        { rootMargin: "480px 0px" },
      );
      globeObserver.observe(sectionRoot);
      globeFallbackTimer = window.setTimeout(() => {
        if (!ThreeGlobe) loadGlobe();
      }, 3000);
    } else {
      loadGlobe();
    }

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
      globeObserver?.disconnect();
      if (globeFallbackTimer) window.clearTimeout(globeFallbackTimer);
      context?.revert();
    };
  });
</script>

<section
  id="global-production-network"
  aria-labelledby="global-production-heading"
  bind:this={sectionRoot}
  data-cursor-trail="off"
  class="network-section relative min-h-[100dvh] overflow-hidden bg-brand-light px-4 text-brand-dark lg:py-0"
>
  <div class="site-shell relative z-10 mx-auto max-w-7xl lg:min-h-[100dvh]">
    <div
      class="grid items-center gap-5 lg:min-h-[100dvh] lg:grid-cols-12 lg:gap-6"
    >
      <div class="z-20 flex flex-col lg:col-span-4 lg:py-6">
        <h2
          id="global-production-heading"
          class="network-copy-step max-w-xl font-display text-[clamp(3rem,5.5vw,5rem)] font-light leading-[0.98] tracking-[-0.035em] text-brand-dark"
        >
          {$_('home.closingCta.heading') || closingCta.heading}
        </h2>

        <p
          class="network-copy-step mt-4 max-w-md text-sm leading-6 text-brand-dark/75"
        >
          {$_('home.closingCta.description') || closingCta.description}
        </p>

        <a
          href={resolve(closingCta.primaryCtaHref)}
          class="network-copy-step mt-8 inline-flex min-h-12 w-fit items-center justify-center gap-3 rounded-[0.55rem] bg-brand-green px-7 text-sm font-semibold text-brand-dark transition-colors duration-300 hover:bg-brand-dark hover:text-brand-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
        >
          <span>{$_('home.closingCta.primaryCtaLabel') || closingCta.primaryCtaLabel}</span>
          <ArrowRight class="h-5 w-5" />
        </a>
      </div>

      <div
        bind:this={globeStage}
        class="globe-stage relative flex min-h-0 items-center justify-center py-6 sm:min-h-[36rem] sm:py-0 lg:col-span-8 lg:min-h-0 lg:translate-x-12 xl:translate-x-20"
      >
        <div class="globe-ambient" aria-hidden="true"></div>
        {#if ThreeGlobe}
          <ThreeGlobe locations={clientLocations} />
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  .network-section::before {
    content: none;
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
    z-index: 0;
    width: min(98%, 46rem);
    aspect-ratio: 1;
    border-radius: 9999px;
    background: radial-gradient(
      circle,
      rgba(126, 166, 65, 0.22) 0%,
      rgba(126, 166, 65, 0.14) 32%,
      rgba(126, 166, 65, 0.06) 52%,
      rgba(126, 166, 65, 0.015) 68%,
      rgba(126, 166, 65, 0) 82%
    );
    pointer-events: none;
    filter: blur(42px);
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
