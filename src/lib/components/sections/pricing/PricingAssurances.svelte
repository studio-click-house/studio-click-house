<script lang="ts">
  import { _ } from "svelte-i18n";

  const assurances = [
    {
      number: "01",
      title: "Multiple quality checks",
      description:
        "Each delivery moves through the same production review path.",
    },
    {
      number: "02",
      title: "Easy file transfer",
      description:
        "Upload source files and receive organised production-ready exports.",
    },
    {
      number: "03",
      title: "24/7 production support",
      description:
        "Keep active batches moving across demanding studio schedules.",
    },
    {
      number: "04",
      title: "Flexible turnaround",
      description:
        "Choose a delivery priority that fits the volume and deadline.",
    },
  ] as const;
</script>

<section
  id="pricing-assurances"
  aria-labelledby="pricing-assurances-title"
  class="relative overflow-hidden bg-brand-dark py-24 text-brand-light sm:py-32"
>
  <div class="site-shell">
    <div class="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div class="lg:col-span-5">
        <h2
          id="pricing-assurances-title"
          class="max-w-[10ch] font-display text-[clamp(2.75rem,5.5vw,4.5rem)] leading-[0.92] tracking-[-0.04em]"
        >
          {$_('pricing.assurances.heading1') || 'Included with'} <em class="font-normal text-brand-green">{$_('pricing.assurances.heading2') || 'every plan.'}</em
          >
        </h2>
        <p
          class="mt-5 max-w-md text-sm leading-relaxed text-brand-light/62 sm:text-base"
        >
          {$_('pricing.assurances.description') || 'The package changes the pace and scale. The production care remains consistent.'}
        </p>
      </div>

      <div
        class="grid border-t border-brand-light/15 sm:grid-cols-2 lg:col-span-7"
      >
        {#each assurances as assurance, index}
          <article
            class="grid min-h-44 grid-cols-[2.25rem_1fr] gap-4 border-b border-brand-light/15 py-7 sm:px-6 sm:odd:border-r"
          >
            <span
              class="font-mono text-[0.58rem] tracking-[0.14em] text-brand-green"
            >
              {assurance.number}
            </span>
            <div>
              <h3 class="font-display text-xl tracking-[-0.02em] sm:text-2xl">
                {$_(`pricing.assurances.items.${index}.title`) || assurance.title}
              </h3>
              <p
                class="mt-3 max-w-xs text-sm leading-relaxed text-brand-light/55"
              >
                {$_(`pricing.assurances.items.${index}.description`) || assurance.description}
              </p>
            </div>
          </article>
        {/each}
      </div>
    </div>
  </div>
</section>
