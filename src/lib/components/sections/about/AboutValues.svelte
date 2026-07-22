<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { AboutPageData } from "$lib/types/about";

  let { values } = $props<{ values: AboutPageData["values"] }>();
  let sectionRef: HTMLElement;

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !sectionRef) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.fromTo(
            ".values-header-reveal",
            { autoAlpha: 0, y: 30 },
            {
              scrollTrigger: { trigger: sectionRef, start: "top 80%" },
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power2.out",
            },
          );

          const valueCards = gsap.utils.toArray<HTMLElement>(".value-card");
          valueCards.forEach((card) => {
            gsap.fromTo(
              card,
              { autoAlpha: 0.35, x: 40 },
              {
                scrollTrigger: {
                  trigger: card,
                  start: "top 86%",
                  end: "top 48%",
                  scrub: 0.45,
                },
                autoAlpha: 1,
                x: 0,
                ease: "none",
              },
            );
          });
        });
      }, sectionRef);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="core-values"
  aria-label="Core Values of Studio Click House"
  bind:this={sectionRef}
  class="section-space relative py-24 md:py-32"
>
  <div class="site-shell grid gap-14 lg:grid-cols-12 lg:gap-16">
    <div
      class="lg:sticky lg:top-1/2 lg:col-span-5 lg:self-start lg:-translate-y-1/2"
    >
      <div class="values-header-reveal mb-4 flex items-center gap-3">
        <span class="h-px w-8 bg-brand-green"></span>
        <p class="eyebrow text-brand-dark/70">{values.eyebrow}</p>
      </div>
      <h2
        class="values-header-reveal mb-6 max-w-[7ch] font-display text-[clamp(3.5rem,6.4vw,7.5rem)] leading-[0.82] tracking-[-0.05em] text-brand-dark"
      >
        {values.heading}
      </h2>
      <p
        class="values-header-reveal max-w-sm text-base leading-relaxed text-brand-dark/70"
      >
        {values.subheading}
      </p>
    </div>

    <div class="values-grid border-t border-brand-dark/25 lg:col-span-7">
      {#each values.items as item (item.number)}
        <article
          class="value-card group grid gap-5 border-b border-brand-dark/25 py-8 transition-colors duration-300 hover:bg-brand-paper/55 sm:grid-cols-[4rem_1fr] sm:gap-7 sm:px-4 md:py-10"
        >
          <span class="font-mono text-sm tracking-[0.18em] text-brand-green"
            >{item.number}</span
          >
          <div
            class="grid gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(14rem,1fr)] md:gap-8"
          >
            <div>
              <h3
                class="font-display text-2xl leading-none tracking-[-0.025em] text-brand-dark md:text-3xl"
              >
                {item.title}
              </h3>
              <p
                class="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-brand-green"
              >
                {item.tagline}
              </p>
            </div>
            <p
              class="max-w-[34rem] text-sm leading-relaxed text-brand-dark/70 md:text-base"
            >
              {item.description}
            </p>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
