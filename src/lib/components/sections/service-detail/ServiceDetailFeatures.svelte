<script lang="ts">
  import { onMount } from "svelte";
  import {
    BadgeDollarSign,
    Palette,
    ShieldCheck,
    TicketCheck,
    Zap,
  } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ServiceFeatureItem } from "$lib/types/service-detail";

  let { heading, items } = $props<{
    heading: string;
    items: ServiceFeatureItem[];
  }>();

  const iconMap: Record<string, typeof Palette> = {
    Palette,
    BadgeDollarSign,
    ShieldCheck,
    Zap,
    TicketCheck,
  };

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
                start: "top 78%",
                once: true,
              },
              defaults: { ease: "power3.out" },
            })
            .from(".sd-features-heading", {
              autoAlpha: 0,
              y: 22,
              duration: 0.72,
            })
            .from(
              ".sd-feature-card",
              {
                autoAlpha: 0,
                y: 26,
                duration: 0.68,
                stagger: 0.07,
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
  class="relative isolate overflow-hidden bg-brand-paper py-16 text-brand-dark sm:py-20 lg:py-24"
>
  <div
    class="pointer-events-none absolute -bottom-48 left-[16%] size-[30rem] rounded-full bg-brand-green/10 blur-[115px]"
    aria-hidden="true"
  ></div>
  <div class="site-shell relative z-10">
    <div class="sd-features-heading mb-9 lg:mb-11">
      <p
        class="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-brand-green"
      >
        Service advantages
      </p>
      <h2
        id="service-detail-features-title"
        class="mt-4 max-w-[14ch] font-display text-[clamp(2.7rem,4.6vw,4.8rem)] leading-[0.9] tracking-[-0.04em]"
      >
        {heading}
      </h2>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each items as item (item.title)}
        {@const IconComponent = iconMap[item.icon]}
        <article
          class="sd-feature-card group rounded-[0.9rem] border border-brand-dark/10 bg-brand-light p-6 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-brand-green/35 hover:shadow-[0_14px_34px_rgb(32_33_31_/_0.06)] sm:p-7"
        >
          <div
            class="flex size-10 items-center justify-center rounded-[0.55rem] bg-brand-green/12 text-brand-green transition-colors duration-300 group-hover:bg-brand-green group-hover:text-brand-dark"
          >
            {#if IconComponent}
              <IconComponent class="size-[1.15rem]" strokeWidth={1.8} />
            {/if}
          </div>
          <h3 class="mt-6 text-lg font-semibold tracking-[-0.01em]">
            {item.title}
          </h3>
          <p class="mt-3 max-w-[42ch] text-sm leading-6 text-brand-dark/62">
            {item.description}
          </p>
        </article>
      {/each}
    </div>
  </div>
</section>
