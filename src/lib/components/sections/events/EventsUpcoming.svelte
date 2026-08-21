<script lang="ts">
  import type { CompanyEvent } from "$lib/types/events";

  interface Props {
    event: CompanyEvent;
  }

  let { event }: Props = $props();
</script>

<section
  id="upcoming-event"
  class="bg-brand-paper py-16 text-brand-dark sm:py-20 lg:py-24"
>
  <div class="site-shell">
    <div class="grid gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
      <figure
        class="relative min-h-[22rem] overflow-hidden rounded-xl sm:min-h-[30rem] lg:col-span-7"
        data-event-media
      >
        <img
          src={event.image}
          alt={event.imageAlt}
          width="1600"
          height="1040"
          class="absolute inset-0 size-full scale-[1.08] object-cover"
          data-event-parallax
        />
      </figure>

      <div
        class="flex flex-col justify-between border-brand-dark/18 lg:col-span-5"
      >
        <div class="space-y-4 sm:space-y-5" data-event-copy>
          <h2
            class="max-w-[13ch] font-display text-[clamp(2.4rem,4.2vw,4.6rem)] leading-[0.94] tracking-[-0.035em]"
          >
            {event.title}
          </h2>

          <p class="text-base leading-relaxed text-brand-dark/68 sm:text-lg">
            {event.summary}
          </p>
        </div>

        <div class="mt-8 space-y-6 border-t border-brand-dark/16 pt-6">
          <dl class="grid grid-cols-2 gap-5">
            <div class="grid gap-1.5">
              <dt
                class="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-brand-dark/44"
              >
                Format
              </dt>
              <dd class="text-sm text-brand-dark/78">{event.format}</dd>
            </div>
            <div class="grid gap-1.5">
              <dt
                class="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-brand-dark/44"
              >
                Place
              </dt>
              <dd class="text-sm text-brand-dark/78">{event.location}</dd>
            </div>
          </dl>

          <ul
            class="flex flex-wrap gap-x-5 gap-y-2"
            aria-label="Event focus areas"
          >
            {#each event.focus as item (item)}
              <li
                class="font-mono text-[0.56rem] uppercase tracking-[0.12em] text-brand-dark/64"
              >
                {item}
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>
