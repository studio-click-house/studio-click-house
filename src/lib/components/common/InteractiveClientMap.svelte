<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
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
      context?.revert();
    };
  });
</script>

<section
  id="global-production-network"
  aria-labelledby="global-production-heading"
  bind:this={sectionRoot}
  data-cursor-trail="off"
  class="network-section relative overflow-hidden bg-brand-light px-4 text-brand-dark"
>
  <!-- Ambient Section Transition Connector (matching client/services scroll pattern) -->
  <div class="network-glow-connector" aria-hidden="true"></div>

  <div class="site-shell relative z-10 mx-auto max-w-7xl">
    <div
      class="grid items-center gap-6 lg:grid-cols-12 lg:gap-8"
    >
      <div class="z-20 flex flex-col lg:col-span-4 lg:py-6">
        <p class="mb-4 font-sans text-sm font-medium text-brand-dark/60 network-copy-step">
          {$_("sectionLabels.project")}
        </p>
        <h2
          id="global-production-heading"
          class="network-copy-step max-w-xl font-sans text-[clamp(2.5rem,4.2vw,4.25rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-brand-dark"
        >
          {$_('home.closingCta.heading') || closingCta.heading}
        </h2>

        <p
          class="network-copy-step mt-5 max-w-md font-sans text-base leading-[1.65] text-brand-dark/75"
        >
          {$_('home.closingCta.description') || closingCta.description}
        </p>

        <a
          href={resolve(closingCta.primaryCtaHref)}
          class="network-copy-step mt-8 inline-flex min-h-12 w-fit items-center justify-center gap-3 rounded-[var(--radius-control)] bg-brand-green px-7 text-sm font-semibold text-brand-dark transition-colors duration-300 hover:bg-brand-dark hover:text-brand-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
        >
          <span>{$_('home.closingCta.primaryCtaLabel') || closingCta.primaryCtaLabel}</span>
          <ArrowRight class="h-5 w-5" />
        </a>
      </div>

      <div
        bind:this={globeStage}
        class="globe-stage relative flex min-h-0 items-center justify-center py-6 sm:min-h-[36rem] sm:py-0 lg:col-span-8 lg:min-h-0 lg:translate-x-12 xl:translate-x-20"
      >
        {#if ThreeGlobe}
          <ThreeGlobe />
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

  /* Ambient Section Transition Connector (matching client/services scroll pattern) */
  .network-glow-connector {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 82% 100% at 50% 100%,
      color-mix(in srgb, var(--color-brand-green) 24%, transparent),
      transparent 75%
    );
    pointer-events: none;
    z-index: 1;
  }

  .globe-stage {
    isolation: isolate;
    will-change: transform, opacity;
  }

  .network-section {
    padding-top: var(--space-section-lg, clamp(6rem, 9vw, 9rem));
    padding-bottom: clamp(2.5rem, 4.5vw, 4.5rem);
  }

  @media (prefers-reduced-motion: reduce) {
    .globe-stage {
      will-change: auto;
    }
  }
</style>
