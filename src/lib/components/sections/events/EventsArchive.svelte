<script lang="ts">
  import type { CompanyEvent } from "$lib/types/events";
  import { _ } from "svelte-i18n";

  interface Props {
    events: CompanyEvent[];
  }

  let { events }: Props = $props();
</script>

<section
  id="event-archive"
  class="bg-brand-paper py-16 text-brand-dark sm:py-20 lg:py-24"
>
  <div class="site-shell">
    <div class="max-w-2xl border-t border-brand-dark/18 pt-5" data-event-copy>
      <p
        class="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brand-green"
      >
        {$_('events.archive.eyebrow') || 'Event archive'}
      </p>
      <h2
        class="mt-5 max-w-[14ch] font-display text-[clamp(2.6rem,4.4vw,4.8rem)] leading-[0.94] tracking-[-0.04em]"
      >
        {$_('events.archive.heading') || 'Moments that shaped the studio.'}
      </h2>
    </div>

    <div class="mt-12 space-y-16 sm:mt-16 sm:space-y-20 lg:space-y-24">
      {#each events as event, index (event.id)}
        <article
          id={`event-${event.id}`}
          class:archive-reverse={index % 2 === 1}
          class="archive-entry grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-10"
          data-event-archive
        >
          <figure
            class="archive-media relative min-h-[19rem] overflow-hidden rounded-xl sm:min-h-[26rem] lg:col-span-7"
            data-event-media
          >
            <img
              src={event.image}
              alt={event.imageAlt}
              width="1500"
              height="1000"
              loading="lazy"
              class="absolute inset-0 size-full scale-[1.08] object-cover"
              data-event-parallax
            />
          </figure>

          <div
            class="archive-copy lg:col-span-4 lg:col-start-9"
            data-event-copy
          >
            <div
              class="flex items-center justify-between gap-4 border-b border-brand-dark/16 pb-4 font-mono text-[0.58rem] uppercase tracking-[0.13em] text-brand-dark/46"
            >
              <span>{event.format}</span>
              <span>{event.date}</span>
            </div>
            <h3
              class="mt-6 font-display text-[clamp(2rem,3.2vw,3.5rem)] leading-[0.96] tracking-[-0.03em]"
            >
              {event.title}
            </h3>
            <p
              class="mt-5 text-sm leading-relaxed text-brand-dark/64 sm:text-base"
            >
              {event.summary}
            </p>
            <p
              class="mt-7 font-mono text-[0.58rem] uppercase tracking-[0.13em] text-brand-green"
            >
              {event.location}
            </p>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  @media (min-width: 64rem) {
    .archive-entry.archive-reverse .archive-media {
      grid-column: 6 / span 7;
      grid-row: 1;
    }

    .archive-entry.archive-reverse .archive-copy {
      grid-column: 1 / span 4;
      grid-row: 1;
    }
  }
</style>
