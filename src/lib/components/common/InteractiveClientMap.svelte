<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { clientLocations } from "$lib/content/home";
  import type { ClientLocationMarker } from "$lib/types/content";
  import { RotateCcw } from "lucide-svelte";
  import ThreeGlobe from "./ThreeGlobe.svelte";

  let selectedLocation = $state<ClientLocationMarker | null>(null);
  let sectionRoot: HTMLDivElement;
  let globeStage: HTMLDivElement;

  const totalClients = clientLocations.reduce(
    (sum, item) => sum + (item.clientCount ?? 0),
    0,
  );

  function handleSelectLocation(location: ClientLocationMarker | null) {
    selectedLocation = location;
  }

  function handleReset() {
    selectedLocation = null;
  }

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

<div
  bind:this={sectionRoot}
  data-cursor-trail="off"
  class="network-section relative overflow-hidden bg-brand-dark px-4 py-20 text-brand-light sm:px-8 sm:py-28 lg:py-36"
>
  <div class="site-shell relative z-10 mx-auto max-w-7xl">
    <div
      class="grid items-center gap-5 lg:min-h-[40rem] lg:grid-cols-12 lg:gap-6"
    >
      <div class="z-20 flex flex-col lg:col-span-4 lg:py-6">
        <h2
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

        {#if selectedLocation}
          <div
            class="network-copy-step mt-5 min-h-10 border-l border-brand-green/55 pl-4"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <span
                  class="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-brand-light/42"
                >
                  Selected region
                </span>
                <p class="mt-1 text-sm text-brand-light">
                  {selectedLocation.country}
                  <span class="ml-2 text-brand-green">
                    {selectedLocation.clientCount !== undefined
                      ? `${selectedLocation.clientCount.toLocaleString()} clients`
                      : "Target market"}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onclick={handleReset}
                class="mt-1 text-brand-light/45 transition-colors hover:text-brand-green focus-visible:outline-2 focus-visible:outline-brand-green"
                aria-label="Reset selected location"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        {/if}
      </div>

      <div
        bind:this={globeStage}
        class="globe-stage relative flex min-h-[32rem] items-center justify-center lg:col-span-8 lg:min-h-[40rem]"
      >
        <div class="globe-ambient" aria-hidden="true"></div>
        <ThreeGlobe
          locations={clientLocations}
          {selectedLocation}
          onSelectLocation={handleSelectLocation}
        />
      </div>
    </div>
  </div>
</div>

<style>
  .network-section::before {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        circle at 76% 34%,
        color-mix(in srgb, var(--color-brand-green) 26%, transparent) 0,
        color-mix(in srgb, var(--color-brand-green) 11%, transparent) 30%,
        transparent 58%
      ),
      radial-gradient(
        ellipse at 58% 92%,
        color-mix(in srgb, var(--color-brand-light) 4%, transparent),
        transparent 46%
      );
    pointer-events: none;
    content: "";
  }

  .network-section::after {
    position: absolute;
    right: -8%;
    bottom: -10%;
    left: -8%;
    height: 54%;
    background:
      radial-gradient(
        ellipse at 70% 100%,
        color-mix(in srgb, var(--color-brand-green) 58%, transparent),
        color-mix(in srgb, var(--color-brand-green) 20%, transparent) 42%,
        transparent 72%
      ),
      linear-gradient(
        to top,
        color-mix(in srgb, var(--color-brand-green) 48%, transparent),
        color-mix(in srgb, var(--color-brand-green) 17%, transparent) 56%,
        transparent
      );
    filter: blur(1.8rem);
    opacity: 1;
    pointer-events: none;
    content: "";
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
      color-mix(in srgb, var(--color-brand-green) 40%, transparent) 0,
      color-mix(in srgb, var(--color-brand-green) 17%, transparent) 36%,
      transparent 70%
    );
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
