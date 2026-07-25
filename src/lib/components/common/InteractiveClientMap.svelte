<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { clientLocations } from "$lib/content/home";
  import ThreeGlobe from "./ThreeGlobe.svelte";

  let sectionRoot: HTMLElement;
  let globeStage: HTMLDivElement;

  const totalClients = clientLocations.reduce(
    (sum, item) => sum + (item.clientCount ?? 0),
    0,
  );

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
                start: "top 98%",
                end: "top 8%",
                scrub: 0.9,
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
  class="network-section relative min-h-[100dvh] overflow-hidden bg-black px-4 py-20 text-brand-light sm:px-8 sm:py-24 lg:py-0"
>
  <div class="site-shell relative z-10 mx-auto max-w-7xl lg:min-h-[100dvh]">
    <div
      class="grid items-center gap-5 lg:min-h-[100dvh] lg:grid-cols-12 lg:gap-6"
    >
      <div class="z-20 flex flex-col lg:col-span-4 lg:py-6">
        <h2
          id="global-production-heading"
          class="network-copy-step max-w-[12ch] font-display text-[clamp(2.35rem,3.35vw,3.75rem)] font-light leading-[0.95] tracking-[-0.035em]"
        >
          Creative production, <span class="text-brand-light/72"
            >without borders.</span
          >
        </h2>

        <p
          class="network-copy-step mt-4 max-w-md text-sm leading-6 text-brand-light/62"
        >
          Studio Click House connects image retouching, video post-production,
          and 3D production through one coordinated global workflow.
        </p>

        <dl
          class="network-copy-step mt-6 grid grid-cols-3 divide-x divide-brand-green/30 border-y border-brand-light/12 py-3.5"
        >
          <div class="pr-4">
            <dd class="font-display text-2xl text-brand-green">24/7</dd>
            <dt
              class="mt-2 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-brand-light/48"
            >
              Production
            </dt>
          </div>
          <div class="px-4">
            <dd class="font-display text-2xl text-brand-green">
              {clientLocations.length.toString().padStart(2, "0")}
            </dd>
            <dt
              class="mt-2 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-brand-light/48"
            >
              Global regions
            </dt>
          </div>
          <div class="pl-4">
            <dd class="font-display text-2xl text-brand-green">
              {totalClients.toLocaleString()}+
            </dd>
            <dt
              class="mt-2 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-brand-light/48"
            >
              Client network
            </dt>
          </div>
        </dl>
      </div>

      <div
        bind:this={globeStage}
        class="globe-stage relative flex min-h-[36rem] items-center justify-center lg:col-span-8 lg:min-h-0"
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
        rgb(6 32 86 / 0.3) 0,
        rgb(6 32 86 / 0.12) 34%,
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

  @media (prefers-reduced-motion: reduce) {
    .globe-stage,
    .globe-ambient {
      will-change: auto;
    }
  }
</style>
