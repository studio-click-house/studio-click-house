<script lang="ts">
  import { onMount } from "svelte";
  import {
    BadgeDollarSign,
    BadgePercent,
    CheckCircle,
    CheckCircle2,
    Clock,
    Cpu,
    Eye,
    FileCheck,
    Focus,
    FolderTree,
    Gem,
    Headphones,
    Layers,
    Lock,
    Maximize2,
    Palette,
    PenTool,
    Scale,
    Scissors,
    ShieldAlert,
    ShieldCheck,
    Shirt,
    Sliders,
    Sparkles,
    Sun,
    TicketCheck,
    UserCheck,
    Wand2,
    Zap,
  } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ServiceFeatureItem } from "$lib/types/service-detail";

  let { heading, items } = $props<{
    heading: string;
    items: ServiceFeatureItem[];
  }>();

  const iconMap: Record<string, any> = {
    BadgeDollarSign,
    BadgePercent,
    CheckCircle,
    CheckCircle2,
    Clock,
    Cpu,
    Eye,
    FileCheck,
    Focus,
    FolderTree,
    Gem,
    Headphones,
    Layers,
    Lock,
    Maximize2,
    Palette,
    PenTool,
    Scale,
    Scissors,
    ShieldAlert,
    ShieldCheck,
    Shirt,
    Sliders,
    Sparkles,
    Sun,
    TicketCheck,
    UserCheck,
    Wand2,
    Zap,
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
  class="relative isolate overflow-hidden py-16 text-brand-dark sm:py-20 lg:py-24"
>
  <div class="site-shell relative z-10">
    <div class="sd-features-heading mb-9 lg:mb-11">
      <h2
        id="service-detail-features-title"
        class="max-w-2xl font-display text-[clamp(2.2rem,3.4vw,3.5rem)] leading-[0.98] tracking-[-0.04em]"
      >
        {heading}
      </h2>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each items as item (item.title)}
        {@const IconComponent = iconMap[item.icon] || Sparkles}
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
