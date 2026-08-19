<script lang="ts">
  import type { EventActivity } from "$lib/types/events";

  interface Props {
    activities: EventActivity[];
  }

  let { activities }: Props = $props();
</script>

<section
  id="company-activities"
  class="bg-brand-paper py-16 text-brand-dark sm:py-20 lg:py-24"
>
  <div class="site-shell">
    <div class="max-w-3xl" data-event-copy>
      <h2
        class="max-w-[15ch] font-display text-[clamp(2.7rem,4.6vw,5rem)] leading-[0.94] tracking-[-0.04em]"
      >
        The work grows when the team does.
      </h2>
      <p
        class="mt-5 max-w-xl text-base leading-relaxed text-brand-dark/64 sm:text-lg"
      >
        Our company activities make room for shared thinking, practical
        learning, and the human connections behind consistent creative work.
      </p>
    </div>

    <div
      class="mt-12 grid gap-4 md:grid-cols-12 md:grid-rows-2"
      data-event-culture
    >
      {#each activities as activity, index (activity.id)}
        <article
          id={`activity-${activity.id}`}
          class:activity-lead={index === 0}
          class="activity-card group relative min-h-[22rem] overflow-hidden rounded-xl bg-brand-dark"
          data-event-culture-card
        >
          <img
            src={activity.image}
            alt={activity.imageAlt}
            width="1440"
            height="900"
            loading="lazy"
            class="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-brand-dark/94 via-brand-dark/20 to-transparent"
          ></div>
          <div
            class="relative flex min-h-[22rem] flex-col justify-end p-6 sm:p-8"
          >
            <h3
              class="font-display text-[clamp(2rem,3vw,3.4rem)] leading-[0.96] tracking-[-0.03em] text-brand-light"
            >
              {activity.title}
            </h3>
            <p
              class="mt-4 max-w-md text-sm leading-relaxed text-brand-light/72 sm:text-base"
            >
              {activity.description}
            </p>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  @media (min-width: 48rem) {
    .activity-card {
      grid-column: span 5;
    }

    .activity-card.activity-lead {
      grid-column: span 7;
      grid-row: span 2;
      min-height: 46rem;
    }
  }
</style>
