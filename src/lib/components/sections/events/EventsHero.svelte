<script lang="ts">
  import type { CompanyEvent } from "$lib/types/events";
  import { _ } from "svelte-i18n";

  interface Props {
    upcoming: CompanyEvent;
    archive: CompanyEvent[];
  }

  let { upcoming, archive }: Props = $props();

  const nepalTour = $derived(archive.find((e) => e.id === "nepal-team-tour") || archive[0]);
  const mawaTour = $derived(archive.find((e) => e.id === "mawa-evening-tour") || archive[1]);
  const footballTour = $derived(archive.find((e) => e.id === "studio-football-championship") || archive[2]);
</script>

<section
  id="events-hero"
  class="relative min-h-[90dvh] overflow-hidden bg-brand-paper pt-28 text-brand-dark sm:pt-32 lg:pt-36"
>
  <div class="site-shell relative z-10 pb-16">
    <div class="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
      <!-- Editorial Copy Column -->
      <div class="lg:col-span-5" data-events-hero-copy>
        <span class="font-mono text-xs uppercase tracking-[0.22em] text-brand-green font-medium mb-4 block">
          Studio Archive · Company Events & Tours
        </span>

        <h1
          class="font-display text-[clamp(3.2rem,5.6vw,6rem)] font-normal leading-[0.92] tracking-tight text-brand-dark"
        >
          Moments beyond the pixels.
        </h1>

        <p
          class="mt-6 max-w-md text-base leading-relaxed text-brand-dark/75 sm:text-lg"
        >
          When production wraps and rendering queues clear, our collective steps out. Mountain ridges, coastal waters, floodlit matches, and celebratory banquets that define Studio Click House.
        </p>

        <!-- Clean Action Buttons (No AI pills) -->
        <div class="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#event-archive"
            class="rounded-lg bg-brand-green px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-brand-dark shadow-sm transition-all hover:bg-brand-dark hover:text-white"
          >
            Explore Tours
          </a>
          <a
            href="#events-gallery"
            class="rounded-lg border border-brand-dark/20 bg-white/80 px-6 py-3 font-mono text-xs uppercase tracking-wider text-brand-dark transition-all hover:border-brand-dark hover:bg-white"
          >
            Browse All Photos
          </a>
        </div>
      </div>

      <!-- Natural Photographic Collage Column -->
      <div
        class="relative min-h-[26rem] sm:min-h-[34rem] lg:col-span-7 lg:min-h-[38rem]"
        data-events-hero-visual
      >
        <!-- Primary Master Frame -->
        <figure
          class="hero-primary absolute right-0 top-0 w-[86%] overflow-hidden rounded-2xl border border-brand-dark/10 bg-white p-2 shadow-xl"
          data-events-hero-primary
        >
          <div class="relative aspect-[16/11] w-full overflow-hidden rounded-xl">
            <img
              src={nepalTour?.image || upcoming.image}
              alt={nepalTour?.imageAlt || upcoming.imageAlt}
              width="1400"
              height="950"
              fetchpriority="high"
              class="size-full object-cover"
              data-events-parallax-image
            />
          </div>
        </figure>

        <!-- Secondary Photo Still -->
        {#if mawaTour}
          <figure
            class="hero-secondary absolute bottom-[8%] left-0 w-[42%] -rotate-2 overflow-hidden rounded-xl border border-brand-dark/12 bg-white p-2 shadow-2xl transition-transform duration-500 hover:rotate-0 hover:scale-105 z-20"
            data-events-hero-card
          >
            <div class="aspect-[4/3] w-full overflow-hidden rounded-lg">
              <img
                src={mawaTour.image}
                alt={mawaTour.imageAlt}
                width="640"
                height="480"
                class="size-full object-cover"
              />
            </div>
            <p class="mt-2 text-center font-mono text-[0.62rem] text-brand-dark/70 uppercase tracking-wider">
              Mawa River Sunset
            </p>
          </figure>
        {/if}

        <!-- Tertiary Photo Still -->
        {#if footballTour}
          <figure
            class="hero-tertiary absolute -bottom-1 right-[10%] w-[38%] rotate-2 overflow-hidden rounded-xl border border-brand-dark/12 bg-white p-2 shadow-2xl transition-transform duration-500 hover:rotate-0 hover:scale-105 z-20"
            data-events-hero-card
          >
            <div class="aspect-[4/3] w-full overflow-hidden rounded-lg">
              <img
                src={footballTour.image}
                alt={footballTour.imageAlt}
                width="600"
                height="450"
                class="size-full object-cover"
              />
            </div>
            <p class="mt-2 text-center font-mono text-[0.62rem] text-brand-dark/70 uppercase tracking-wider">
              Studio Football League
            </p>
          </figure>
        {/if}
      </div>
    </div>
  </div>
</section>
