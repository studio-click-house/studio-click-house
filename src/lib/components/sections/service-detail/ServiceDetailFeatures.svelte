<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ServiceFeatureItem } from "$lib/types/service-detail";

  let {
    heading,
    eyebrow = "Studio Capabilities",
    description = "From clean product cutouts to complex multi-layered edge isolation, our studio handles fine details, transparent materials, and consistent outputs at scale.",
    items,
  } = $props<{
    heading: string;
    eyebrow?: string;
    description?: string;
    items: ServiceFeatureItem[];
  }>();

  let section = $state<HTMLElement>();

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 95%",
                once: true,
              },
              defaults: { ease: "power3.out" },
            })
            .from(".sd-features-header", {
              autoAlpha: 0,
              y: 22,
              duration: 0.42,
              clearProps: "all",
            })
            .from(
              ".sd-feature-cell",
              {
                autoAlpha: 0,
                y: 20,
                duration: 0.4,
                stagger: 0.035,
                clearProps: "all",
              },
              "-=0.4",
            );
        });

        return () => media.revert();
      }, section);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  bind:this={section}
  id="service-detail-features"
  aria-labelledby="service-detail-features-title"
  class="relative isolate overflow-hidden bg-brand-light py-20 text-brand-dark sm:py-24 lg:py-28"
>
  <div class="site-shell relative z-10">
    <!-- Split Header matching reference -->
    <div
      class="sd-features-header mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between lg:gap-12"
    >
      <div>
        <span
          class="font-mono text-[0.64rem] font-bold uppercase tracking-[0.2em] text-brand-dark/50"
        >
          {eyebrow}
        </span>
        <h2
          id="service-detail-features-title"
          class="mt-3 max-w-[20ch] font-display text-[length:var(--text-section)] leading-[0.98] tracking-[-0.04em] text-brand-dark"
        >
          {heading}
        </h2>
      </div>

      {#if description}
        <p
          class="shrink-0 max-w-[38ch] text-sm leading-relaxed text-brand-dark/65 sm:text-base lg:pb-0.5"
        >
          {description}
        </p>
      {/if}
    </div>

    <!-- Rounded Cards — always visible, subtle border, no full-fill hover -->
    <div
      class="sd-features-grid grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
    >
      {#each items as item, i (item.title)}
        <div
          class="sd-feature-cell group relative flex flex-col justify-start rounded-[1.75rem] border border-brand-dark/10 bg-white/80 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-green hover:shadow-md sm:rounded-[2rem] sm:p-9 lg:p-10"
        >
          <!-- Big Bold Watermark Number -->
          <span
            class="font-display text-4xl font-black tracking-tight text-brand-dark/15 transition-colors duration-300 group-hover:text-brand-green/40 sm:text-5xl"
          >
            {String(i + 1).padStart(2, "0")}
          </span>

          <!-- Bold Uppercase Title -->
          <h3
            class="mt-5 font-display text-base font-extrabold uppercase tracking-tight text-brand-dark sm:text-lg"
          >
            {item.title}
          </h3>

          <!-- Description -->
          <p
            class="mt-3 text-sm leading-relaxed text-brand-dark/65"
          >
            {item.description}
          </p>
        </div>
      {/each}
    </div>
  </div>
</section>
