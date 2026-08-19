<script lang="ts">
  import type { CompanyEvent } from "$lib/types/events";

  interface Props {
    upcoming: CompanyEvent;
    archive: CompanyEvent[];
  }

  let { upcoming, archive }: Props = $props();
</script>

<section
  id="events-hero"
  class="relative min-h-[100dvh] overflow-hidden bg-brand-dark pt-20 text-brand-light sm:pt-24"
>
  <div
    class="site-shell relative grid min-h-[calc(100dvh-5rem)] content-center gap-8 pb-10 pt-6 md:grid-cols-12 md:items-center md:gap-6 lg:pb-14"
  >
    <div class="relative z-10 md:col-span-5" data-events-hero-copy>
      <p
        class="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brand-green"
      >
        Company events
      </p>
      <h1
        class="mt-5 max-w-[9ch] font-display text-[clamp(3.5rem,6.2vw,6.6rem)] leading-[0.88] tracking-[-0.045em]"
      >
        Studio in motion.
      </h1>
      <p
        class="mt-6 max-w-sm text-base leading-relaxed text-brand-light/68 sm:text-lg"
      >
        Sessions and shared moments that move our craft and company forward.
      </p>
    </div>

    <div
      class="relative min-h-[25rem] md:col-span-7 md:min-h-[34rem] lg:min-h-[39rem]"
      data-events-hero-visual
    >
      <figure
        class="hero-primary absolute inset-y-0 right-0 w-[86%] overflow-hidden rounded-xl"
        data-events-hero-primary
      >
        <img
          src={upcoming.image}
          alt={upcoming.imageAlt}
          width="1200"
          height="1500"
          fetchpriority="high"
          class="size-full scale-[1.06] object-cover"
          data-events-parallax-image
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-brand-dark/55 via-transparent to-transparent"
        ></div>
      </figure>

      {#if archive[0]}
        <figure
          class="hero-secondary absolute bottom-[7%] left-0 w-[38%] overflow-hidden rounded-xl border border-brand-light/14 bg-brand-dark p-1.5 shadow-2xl"
          data-events-hero-card
        >
          <img
            src={archive[0].image}
            alt={archive[0].imageAlt}
            width="720"
            height="900"
            class="aspect-[4/5] w-full object-cover"
          />
        </figure>
      {/if}

      {#if archive[1]}
        <figure
          class="hero-tertiary absolute left-[9%] top-[7%] w-[27%] overflow-hidden rounded-xl border border-brand-light/14 bg-brand-dark p-1.5 shadow-2xl"
          data-events-hero-card
        >
          <img
            src={archive[1].image}
            alt={archive[1].imageAlt}
            width="640"
            height="480"
            class="aspect-[4/3] w-full object-cover"
          />
        </figure>
      {/if}
    </div>
  </div>
</section>
